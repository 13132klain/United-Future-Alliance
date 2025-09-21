import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll, 
  getMetadata,
  UploadResult 
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { storage, db, isFirebaseConfigured } from './firebase';
import { indexedDBFileStorageService } from './indexedDBFileStorageService';

export interface FileMetadata {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  downloadURL: string;
  storagePath: string;
  category: string;
  subcategory?: string;
  description?: string;
  author?: string;
  tags?: string[];
  uploadDate: any;
  lastModified: any;
  downloadCount: number;
  isPublic: boolean;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

class FileStorageService {
  private readonly COLLECTIONS = {
    FILES: 'files',
    CONSTITUTION: 'constitution',
    VOTER_GUIDE: 'voterGuide',
    ACTION_TOOLKIT: 'actionToolkit',
    DIGITAL_GUIDE: 'digitalGuide',
    RESEARCH: 'research'
  };

  /**
   * Upload a file to IndexedDB (fallback to Firebase Storage if configured)
   */
  async uploadFile(
    file: File, 
    category: string, 
    subcategory?: string,
    metadata?: Partial<FileMetadata>
  ): Promise<{ success: boolean; fileId?: string; downloadURL?: string; error?: string }> {
    // Use IndexedDB for file storage (no CORS issues)
    try {
      console.log('📁 Uploading file to IndexedDB:', file.name);
      
      const result = await indexedDBFileStorageService.uploadFile(file, category, subcategory, metadata);
      
      if (result.success) {
        console.log('✅ File uploaded successfully to IndexedDB:', {
          fileId: result.fileId,
          fileName: file.name,
          size: file.size,
          category
        });
      }
      
      return result;
    } catch (error) {
      console.error('❌ IndexedDB upload failed, trying Firebase fallback:', error);
      
      // Fallback to Firebase Storage if IndexedDB fails
      if (isFirebaseConfigured() && storage && db) {
        return this.uploadToFirebase(file, category, subcategory, metadata);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Upload to Firebase Storage (fallback method)
   */
  private async uploadToFirebase(
    file: File, 
    category: string, 
    subcategory?: string,
    metadata?: Partial<FileMetadata>
  ): Promise<{ success: boolean; fileId?: string; downloadURL?: string; error?: string }> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${category}_${timestamp}.${fileExtension}`;
      const storagePath = `${category}/${fileName}`;

      // Create storage reference
      const storageRef = ref(storage, storagePath);

      // Upload file to Firebase Storage
      const uploadResult: UploadResult = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Get file metadata
      const fileMetadata = await getMetadata(uploadResult.ref);

      // Prepare document data
      const fileData: Omit<FileMetadata, 'id'> = {
        name: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        downloadURL,
        storagePath,
        category,
        subcategory: subcategory || '',
        description: metadata?.description || '',
        author: metadata?.author || 'UFA Admin',
        tags: metadata?.tags || [],
        uploadDate: serverTimestamp(),
        lastModified: serverTimestamp(),
        downloadCount: 0,
        isPublic: true,
        ...metadata
      };

      // Save metadata to Firestore
      const docRef = await addDoc(collection(db, this.COLLECTIONS.FILES), fileData);

      console.log('✅ File uploaded successfully to Firebase:', {
        fileId: docRef.id,
        fileName: file.name,
        size: file.size,
        category,
        downloadURL
      });

      return {
        success: true,
        fileId: docRef.id,
        downloadURL
      };

    } catch (error) {
      console.error('❌ Firebase upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Get all files for a specific category
   */
  async getFilesByCategory(category: string): Promise<FileMetadata[]> {
    try {
      // Use IndexedDB first
      const indexedDBFiles = await indexedDBFileStorageService.getFilesByCategory(category);
      
      if (indexedDBFiles.length > 0) {
        return indexedDBFiles;
      }
      
      // Fallback to Firebase if no files in IndexedDB
      if (isFirebaseConfigured() && db) {
        const q = query(
          collection(db, this.COLLECTIONS.FILES),
          where('category', '==', category),
          orderBy('uploadDate', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const files: FileMetadata[] = [];

        querySnapshot.forEach((doc) => {
          files.push({
            id: doc.id,
            ...doc.data()
          } as FileMetadata);
        });

        return files;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to get files by category:', error);
      return [];
    }
  }

  /**
   * Get a specific file by ID
   */
  async getFileById(fileId: string): Promise<FileMetadata | null> {
    try {
      const docRef = doc(db, this.COLLECTIONS.FILES, fileId);
      const docSnap = await getDocs(query(collection(db, this.COLLECTIONS.FILES), where('__name__', '==', fileId)));
      
      if (!docSnap.empty) {
        const fileData = docSnap.docs[0].data();
        return {
          id: docSnap.docs[0].id,
          ...fileData
        } as FileMetadata;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to get file by ID:', error);
      return null;
    }
  }

  /**
   * Download a file (increment download count)
   */
  async downloadFile(fileId: string): Promise<{ success: boolean; downloadURL?: string; error?: string }> {
    try {
      const file = await this.getFileById(fileId);
      if (!file) {
        return { success: false, error: 'File not found' };
      }

      // Increment download count
      const fileRef = doc(db, this.COLLECTIONS.FILES, fileId);
      await updateDoc(fileRef, {
        downloadCount: file.downloadCount + 1,
        lastModified: serverTimestamp()
      });

      return {
        success: true,
        downloadURL: file.downloadURL
      };
    } catch (error) {
      console.error('❌ Download failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      };
    }
  }

  /**
   * Delete a file from both Storage and Firestore
   */
  async deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const file = await this.getFileById(fileId);
      if (!file) {
        return { success: false, error: 'File not found' };
      }

      // Delete from Storage
      const storageRef = ref(storage, file.storagePath);
      await deleteObject(storageRef);

      // Delete from Firestore
      const fileRef = doc(db, this.COLLECTIONS.FILES, fileId);
      await deleteDoc(fileRef);

      console.log('✅ File deleted successfully:', fileId);
      return { success: true };
    } catch (error) {
      console.error('❌ File deletion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deletion failed'
      };
    }
  }

  /**
   * Get file statistics
   */
  async getFileStats(): Promise<{
    totalFiles: number;
    totalDownloads: number;
    filesByCategory: Record<string, number>;
  }> {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTIONS.FILES));
      
      let totalFiles = 0;
      let totalDownloads = 0;
      const filesByCategory: Record<string, number> = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FileMetadata;
        totalFiles++;
        totalDownloads += data.downloadCount || 0;
        
        if (filesByCategory[data.category]) {
          filesByCategory[data.category]++;
        } else {
          filesByCategory[data.category] = 1;
        }
      });

      return {
        totalFiles,
        totalDownloads,
        filesByCategory
      };
    } catch (error) {
      console.error('❌ Failed to get file stats:', error);
      return {
        totalFiles: 0,
        totalDownloads: 0,
        filesByCategory: {}
      };
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, allowedTypes: string[] = ['application/pdf'], maxSizeMB: number = 50): {
    isValid: boolean;
    error?: string;
  } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size too large. Maximum size: ${maxSizeMB}MB`
      };
    }

    return { isValid: true };
  }
}

// Export singleton instance
export const fileStorageService = new FileStorageService();
