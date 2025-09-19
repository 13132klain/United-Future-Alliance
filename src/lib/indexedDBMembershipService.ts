import { Membership } from '../types';

interface IndexedDBMembershipService {
  getMemberships(): Promise<Membership[]>;
  addMembership(membership: Omit<Membership, 'id'>): Promise<string>;
  updateMembership(id: string, membership: Partial<Membership>): Promise<void>;
  deleteMembership(id: string): Promise<void>;
  subscribeToMemberships(callback: (memberships: Membership[]) => void): () => void;
}

class IndexedDBMembershipService implements IndexedDBMembershipService {
  private readonly DB_NAME = 'UFAMembershipDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'memberships';
  private db: IDBDatabase | null = null;
  private subscribers: ((memberships: Membership[]) => void)[] = [];

  /**
   * Initialize IndexedDB
   */
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
        
        // Create object store for memberships
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('email', 'email', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('submittedAt', 'submittedAt', { unique: false });
        }
      };
    });
  }

  /**
   * Convert IndexedDB request to Promise
   */
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Notify all subscribers of data changes
   */
  private async notifySubscribers(): Promise<void> {
    if (this.subscribers.length === 0) return;
    
    const memberships = await this.getMemberships();
    this.subscribers.forEach(callback => {
      try {
        callback([...memberships]);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  /**
   * Get all memberships
   */
  async getMemberships(): Promise<Membership[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      const memberships = await this.promisifyRequest(request);
      
      // Convert date strings back to Date objects
      return memberships.map(membership => ({
        ...membership,
        dateOfBirth: new Date(membership.dateOfBirth),
        submittedAt: new Date(membership.submittedAt),
        reviewedAt: membership.reviewedAt ? new Date(membership.reviewedAt) : undefined
      }));
    } catch (error) {
      console.error('Error getting memberships from IndexedDB:', error);
      return [];
    }
  }

  /**
   * Add new membership
   */
  async addMembership(membership: Omit<Membership, 'id'>): Promise<string> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const newId = Date.now().toString();
      const newMembership: Membership = {
        id: newId,
        ...membership
      };
      
      await this.promisifyRequest(store.add(newMembership));
      
      console.log('✅ Membership added to IndexedDB with ID:', newId);
      
      // Notify subscribers
      await this.notifySubscribers();
      
      return newId;
    } catch (error) {
      console.error('Error adding membership to IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Update membership
   */
  async updateMembership(id: string, membership: Partial<Membership>): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      // Get existing membership
      const existingMembership = await this.promisifyRequest(store.get(id));
      if (!existingMembership) {
        throw new Error(`Membership with ID ${id} not found`);
      }
      
      // Update with new data
      const updatedMembership = {
        ...existingMembership,
        ...membership
      };
      
      await this.promisifyRequest(store.put(updatedMembership));
      
      console.log('✅ Membership updated in IndexedDB:', id);
      
      // Notify subscribers
      await this.notifySubscribers();
    } catch (error) {
      console.error('Error updating membership in IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Delete membership
   */
  async deleteMembership(id: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      await this.promisifyRequest(store.delete(id));
      
      console.log('✅ Membership deleted from IndexedDB:', id);
      
      // Notify subscribers
      await this.notifySubscribers();
    } catch (error) {
      console.error('Error deleting membership from IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Subscribe to membership changes
   */
  subscribeToMemberships(callback: (memberships: Membership[]) => void): () => void {
    console.log('🔍 IndexedDB membership subscription set up');
    
    // Add callback to subscribers
    this.subscribers.push(callback);
    
    // Call callback immediately with current data
    this.getMemberships().then(memberships => {
      console.log('🔍 IndexedDB initial data loaded:', memberships.length, 'memberships');
      callback([...memberships]);
    }).catch(error => {
      console.error('Error loading initial memberships:', error);
      callback([]);
    });
    
    // Return unsubscribe function
    return () => {
      console.log('🔍 Unsubscribing from IndexedDB memberships');
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * Get membership by ID
   */
  async getMembershipById(id: string): Promise<Membership | null> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const membership = await this.promisifyRequest(store.get(id));
      
      if (!membership) return null;
      
      // Convert date strings back to Date objects
      return {
        ...membership,
        dateOfBirth: new Date(membership.dateOfBirth),
        submittedAt: new Date(membership.submittedAt),
        reviewedAt: membership.reviewedAt ? new Date(membership.reviewedAt) : undefined
      };
    } catch (error) {
      console.error('Error getting membership by ID from IndexedDB:', error);
      return null;
    }
  }

  /**
   * Get memberships by status
   */
  async getMembershipsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Membership[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('status');
      
      const request = index.getAll(status);
      const memberships = await this.promisifyRequest(request);
      
      // Convert date strings back to Date objects
      return memberships.map(membership => ({
        ...membership,
        dateOfBirth: new Date(membership.dateOfBirth),
        submittedAt: new Date(membership.submittedAt),
        reviewedAt: membership.reviewedAt ? new Date(membership.reviewedAt) : undefined
      }));
    } catch (error) {
      console.error('Error getting memberships by status from IndexedDB:', error);
      return [];
    }
  }

  /**
   * Clear all memberships (for testing)
   */
  async clearAllMemberships(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      await this.promisifyRequest(store.clear());
      
      console.log('✅ All memberships cleared from IndexedDB');
      
      // Notify subscribers
      await this.notifySubscribers();
    } catch (error) {
      console.error('Error clearing memberships from IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<{ total: number; pending: number; approved: number; rejected: number }> {
    try {
      const memberships = await this.getMemberships();
      
      return {
        total: memberships.length,
        pending: memberships.filter(m => m.status === 'pending').length,
        approved: memberships.filter(m => m.status === 'approved').length,
        rejected: memberships.filter(m => m.status === 'rejected').length
      };
    } catch (error) {
      console.error('Error getting membership stats from IndexedDB:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }
}

// Create singleton instance
const indexedDBMembershipService = new IndexedDBMembershipService();

export default indexedDBMembershipService;
