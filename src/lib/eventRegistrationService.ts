import { EventRegistration } from '../types';
import { db, firebaseInitialized } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';

// IndexedDB fallback for event registrations
class IndexedDBEventRegistrationService {
  private readonly DB_NAME = 'UFAEventRegistrationDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'eventRegistrations';
  private db: IDBDatabase | null = null;
  private subscribers: ((registrations: EventRegistration[]) => void)[] = [];

  private async initDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('eventId', 'eventId', { unique: false });
          store.createIndex('email', 'email', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('registrationDate', 'registrationDate', { unique: false });
        }
      };
    });
  }

  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getEventRegistrations(): Promise<EventRegistration[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const registrations = await this.promisifyRequest(store.getAll());
      return registrations.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    } catch (error) {
      console.error('Error getting event registrations from IndexedDB:', error);
      return [];
    }
  }

  async getRegistrationsByEvent(eventId: string): Promise<EventRegistration[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('eventId');
      
      const registrations = await this.promisifyRequest(index.getAll(eventId));
      return registrations.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    } catch (error) {
      console.error('Error getting registrations by event from IndexedDB:', error);
      return [];
    }
  }

  async addEventRegistration(registration: Omit<EventRegistration, 'id'>): Promise<{id: string, confirmationCode: string}> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const newId = Date.now().toString();
      const newRegistration: EventRegistration = {
        id: newId,
        ...registration
      };
      
      await this.promisifyRequest(store.add(newRegistration));
      
      console.log('✅ Event registration added to IndexedDB with ID:', newId);
      
      // Notify subscribers
      await this.notifySubscribers();
      
      return { id: newId, confirmationCode: registration.confirmationCode };
    } catch (error) {
      console.error('Error adding event registration to IndexedDB:', error);
      throw error;
    }
  }

  async updateEventRegistration(id: string, registration: Partial<EventRegistration>): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const existingRegistration = await this.promisifyRequest(store.get(id));
      if (!existingRegistration) {
        throw new Error('Event registration not found');
      }
      
      const updatedRegistration = { ...existingRegistration, ...registration };
      await this.promisifyRequest(store.put(updatedRegistration));
      
      console.log('✅ Event registration updated in IndexedDB:', id);
      
      // Notify subscribers
      await this.notifySubscribers();
    } catch (error) {
      console.error('Error updating event registration in IndexedDB:', error);
      throw error;
    }
  }

  async subscribeToEventRegistrations(callback: (registrations: EventRegistration[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Load initial data
    this.getEventRegistrations().then(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private async notifySubscribers(): Promise<void> {
    const registrations = await this.getEventRegistrations();
    this.subscribers.forEach(callback => callback(registrations));
  }
}

// Create singleton instance
const indexedDBEventRegistrationService = new IndexedDBEventRegistrationService();

// Generate confirmation code
const generateConfirmationCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Event Registration Service
export const eventRegistrationService = {
  // Get all event registrations
  async getEventRegistrations(): Promise<EventRegistration[]> {
    console.log('🔍 eventRegistrationService.getEventRegistrations called');
    
    if (!firebaseInitialized || !db) {
      console.log('✅ Firebase not properly initialized, using IndexedDB for event registrations');
      return await indexedDBEventRegistrationService.getEventRegistrations();
    }
    
    try {
      const registrationsRef = collection(db, 'eventRegistrations');
      const q = query(registrationsRef, orderBy('registrationDate', 'desc'));
      const snapshot = await getDocs(q);
      
      const registrations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate?.toDate() || new Date(),
        checkedInAt: doc.data().checkedInAt?.toDate() || undefined
      })) as EventRegistration[];
      
      console.log('✅ Event registrations loaded from Firestore:', registrations.length);
      return registrations;
    } catch (error) {
      console.error('Error loading event registrations from Firestore:', error);
      console.log('Falling back to IndexedDB');
      return await indexedDBEventRegistrationService.getEventRegistrations();
    }
  },

  // Get registrations for a specific event
  async getRegistrationsByEvent(eventId: string): Promise<EventRegistration[]> {
    console.log('🔍 eventRegistrationService.getRegistrationsByEvent called for event:', eventId);
    
    if (!firebaseInitialized || !db) {
      console.log('✅ Firebase not properly initialized, using IndexedDB for event registrations');
      return await indexedDBEventRegistrationService.getRegistrationsByEvent(eventId);
    }
    
    try {
      const registrationsRef = collection(db, 'eventRegistrations');
      const q = query(
        registrationsRef, 
        where('eventId', '==', eventId),
        orderBy('registrationDate', 'desc')
      );
      const snapshot = await getDocs(q);
      
      const registrations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        registrationDate: doc.data().registrationDate?.toDate() || new Date(),
        checkedInAt: doc.data().checkedInAt?.toDate() || undefined
      })) as EventRegistration[];
      
      console.log('✅ Event registrations loaded from Firestore for event:', eventId, 'count:', registrations.length);
      return registrations;
    } catch (error) {
      console.error('Error loading event registrations from Firestore:', error);
      console.log('Falling back to IndexedDB');
      return await indexedDBEventRegistrationService.getRegistrationsByEvent(eventId);
    }
  },

  // Register for an event
  async registerForEvent(
    eventId: string, 
    eventTitle: string, 
    userDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      idNumber?: string;
      county?: string;
      constituency?: string;
      interests?: string[];
      additionalInfo?: string;
    }
  ): Promise<{ success: boolean; message: string; confirmationCode?: string; registrationId?: string }> {
    console.log('🔍 eventRegistrationService.registerForEvent called for event:', eventId);
    
    try {
      // Generate confirmation code
      const confirmationCode = generateConfirmationCode();
      
      const registrationData: Omit<EventRegistration, 'id'> = {
        eventId,
        eventTitle,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        phone: userDetails.phone,
        idNumber: userDetails.idNumber || '',
        county: userDetails.county || '',
        constituency: userDetails.constituency || '',
        interests: userDetails.interests || [],
        additionalInfo: userDetails.additionalInfo || '',
        registrationDate: new Date(),
        status: 'pending',
        confirmationCode,
        checkedIn: false
      };

      if (!firebaseInitialized || !db) {
        console.log('✅ Firebase not properly initialized, using IndexedDB for event registration');
        const result = await indexedDBEventRegistrationService.addEventRegistration(registrationData);
        console.log('✅ IndexedDB addEventRegistration result:', result);
        return {
          success: true,
          message: `Event registration confirmed! You will receive event details via email. Confirmation Code: ${confirmationCode}`,
          confirmationCode,
          registrationId: result.id
        };
      }
      
      try {
        const registrationsRef = collection(db, 'eventRegistrations');
        const docRef = await addDoc(registrationsRef, {
          ...registrationData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log('✅ Event registration added to Firestore with ID:', docRef.id);
        return {
          success: true,
          message: `Event registration confirmed! You will receive event details via email. Confirmation Code: ${confirmationCode}`,
          confirmationCode,
          registrationId: docRef.id
        };
      } catch (error) {
        console.error('Error adding event registration to Firestore:', error);
        console.log('Falling back to IndexedDB');
        const result = await indexedDBEventRegistrationService.addEventRegistration(registrationData);
        return {
          success: true,
          message: `Event registration confirmed! You will receive event details via email. Confirmation Code: ${confirmationCode}`,
          confirmationCode,
          registrationId: result.id
        };
      }
    } catch (error) {
      console.error('❌ Error registering for event:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  },

  // Update registration status (for admin use)
  async updateRegistrationStatus(
    registrationId: string, 
    status: 'pending' | 'confirmed' | 'cancelled'
  ): Promise<{ success: boolean; message: string }> {
    console.log('🔍 eventRegistrationService.updateRegistrationStatus called for registration:', registrationId);
    
    try {
      if (!firebaseInitialized || !db) {
        console.log('✅ Firebase not properly initialized, using IndexedDB for event registration update');
        await indexedDBEventRegistrationService.updateEventRegistration(registrationId, { status });
        return {
          success: true,
          message: 'Registration status updated successfully'
        };
      }
      
      try {
        const registrationRef = doc(db, 'eventRegistrations', registrationId);
        await updateDoc(registrationRef, {
          status,
          updatedAt: serverTimestamp()
        });
        
        console.log('✅ Event registration status updated in Firestore:', registrationId);
        return {
          success: true,
          message: 'Registration status updated successfully'
        };
      } catch (error) {
        console.error('Error updating event registration status in Firestore:', error);
        console.log('Falling back to IndexedDB');
        await indexedDBEventRegistrationService.updateEventRegistration(registrationId, { status });
        return {
          success: true,
          message: 'Registration status updated successfully'
        };
      }
    } catch (error) {
      console.error('❌ Error updating registration status:', error);
      return {
        success: false,
        message: 'Failed to update registration status'
      };
    }
  },

  // Check in a participant (for admin use)
  async checkInParticipant(registrationId: string): Promise<{ success: boolean; message: string }> {
    console.log('🔍 eventRegistrationService.checkInParticipant called for registration:', registrationId);
    
    try {
      if (!firebaseInitialized || !db) {
        console.log('✅ Firebase not properly initialized, using IndexedDB for check-in');
        await indexedDBEventRegistrationService.updateEventRegistration(registrationId, { 
          checkedIn: true, 
          checkedInAt: new Date() 
        });
        return {
          success: true,
          message: 'Participant checked in successfully'
        };
      }
      
      try {
        const registrationRef = doc(db, 'eventRegistrations', registrationId);
        await updateDoc(registrationRef, {
          checkedIn: true,
          checkedInAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log('✅ Participant checked in Firestore:', registrationId);
        return {
          success: true,
          message: 'Participant checked in successfully'
        };
      } catch (error) {
        console.error('Error checking in participant in Firestore:', error);
        console.log('Falling back to IndexedDB');
        await indexedDBEventRegistrationService.updateEventRegistration(registrationId, { 
          checkedIn: true, 
          checkedInAt: new Date() 
        });
        return {
          success: true,
          message: 'Participant checked in successfully'
        };
      }
    } catch (error) {
      console.error('❌ Error checking in participant:', error);
      return {
        success: false,
        message: 'Failed to check in participant'
      };
    }
  },

  // Subscribe to real-time updates
  subscribeToEventRegistrations(callback: (registrations: EventRegistration[]) => void): () => void {
    if (!firebaseInitialized || !db) {
      console.log('✅ Firebase not properly initialized, using IndexedDB subscription for event registrations');
      return indexedDBEventRegistrationService.subscribeToEventRegistrations(callback);
    }
    
    // For now, return IndexedDB subscription as Firestore real-time subscription needs more setup
    return indexedDBEventRegistrationService.subscribeToEventRegistrations(callback);
  }
};
