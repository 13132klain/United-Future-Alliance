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
  uploadDate: string;
  lastModified: string;
  downloadCount: number;
  isPublic: boolean;
  fileData?: ArrayBuffer; // Include file data in the metadata
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

class IndexedDBFileStorageService {
  private readonly DB_NAME = 'UFAFileStorage';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'files';
  private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly ALLOWED_TYPES = ['application/pdf'];
  private db: IDBDatabase | null = null;

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
        
        // Create object store for files
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('uploadDate', 'uploadDate', { unique: false });
        }
      };
    });
  }

  /**
   * Upload a file to IndexedDB
   */
  async uploadFile(
    file: File, 
    category: string, 
    subcategory?: string,
    metadata?: Partial<FileMetadata>
  ): Promise<{ success: boolean; fileId?: string; downloadURL?: string; error?: string }> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Initialize database
      const db = await this.initDB();

      // Generate unique ID and filename
      const fileId = this.generateFileId();
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${category}_${timestamp}.${fileExtension}`;
      const storagePath = `${category}/${fileName}`;

      // Convert file to ArrayBuffer
      const fileData = await this.fileToArrayBuffer(file);

      // Create file metadata
      const fileMetadata: FileMetadata = {
        id: fileId,
        name: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        downloadURL: `#download-${fileId}`,
        storagePath,
        category,
        subcategory: subcategory || '',
        description: metadata?.description || '',
        author: metadata?.author || 'UFA Admin',
        tags: metadata?.tags || [],
        uploadDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        downloadCount: 0,
        isPublic: true,
        ...metadata
      };

      // Store file data and metadata in IndexedDB
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      // Store metadata with file data included
      const fileRecord = {
        ...fileMetadata,
        fileData: fileData
      };
      
      await this.promisifyRequest(store.put(fileRecord));

      console.log('✅ File uploaded successfully to IndexedDB:', {
        fileId,
        fileName: file.name,
        size: file.size,
        category
      });

      return {
        success: true,
        fileId,
        downloadURL: fileMetadata.downloadURL
      };

    } catch (error) {
      console.error('❌ File upload failed:', error);
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
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('category');
      
      const files = await this.promisifyRequest(index.getAll(category));
      return files.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
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
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const file = await this.promisifyRequest(store.get(fileId));
      return file || null;
    } catch (error) {
      console.error('❌ Failed to get file by ID:', error);
      return null;
    }
  }

  /**
   * Download a file (increment download count and trigger download)
   */
  async downloadFile(fileId: string): Promise<{ success: boolean; downloadURL?: string; error?: string }> {
    try {
      const file = await this.getFileById(fileId);
      if (!file) {
        return { success: false, error: 'File not found' };
      }

      // Get file data from IndexedDB
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const fileRecord = await this.promisifyRequest(store.get(fileId));

      if (!fileRecord || !fileRecord.fileData) {
        return { success: false, error: 'File data not found' };
      }

      // Increment download count
      const updateTransaction = db.transaction([this.STORE_NAME], 'readwrite');
      const updateStore = updateTransaction.objectStore(this.STORE_NAME);
      file.downloadCount += 1;
      file.lastModified = new Date().toISOString();
      await this.promisifyRequest(updateStore.put(file));

      // Create download URL
      const downloadURL = this.createDownloadURL(fileRecord.fileData, file);
      
      return {
        success: true,
        downloadURL
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
   * Delete a file from IndexedDB
   */
  async deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      // Delete file record (includes both metadata and file data)
      await this.promisifyRequest(store.delete(fileId));

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
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const allFiles = await this.promisifyRequest(store.getAll());
      
      let totalFiles = allFiles.length;
      let totalDownloads = 0;
      const filesByCategory: Record<string, number> = {};

      allFiles.forEach(file => {
        if (file.downloadCount) {
          totalDownloads += file.downloadCount;
        }
        
        if (filesByCategory[file.category]) {
          filesByCategory[file.category]++;
        } else {
          filesByCategory[file.category] = 1;
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
  validateFile(file: File, allowedTypes: string[] = this.ALLOWED_TYPES, maxSizeMB: number = 100): {
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

  /**
   * Generate unique file ID
   */
  private generateFileId(): string {
    return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Convert file to ArrayBuffer
   */
  private fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Create download URL for file
   */
  private createDownloadURL(fileData: ArrayBuffer, file: FileMetadata): string {
    // Create a blob from the ArrayBuffer
    const blob = new Blob([fileData], { type: file.type });
    
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return url;
  }

  /**
   * Promisify IndexedDB requests
   */
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all files (for testing/reset)
   */
  async clearAllFiles(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      await this.promisifyRequest(store.clear());
      console.log('🗑️ All files cleared from IndexedDB');
    } catch (error) {
      console.error('Failed to clear files:', error);
    }
  }

  /**
   * Get storage usage info
   */
  async getStorageInfo(): Promise<{ used: number; available: number; percentage: number }> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const available = estimate.quota || 0;
        const percentage = available > 0 ? (used / available) * 100 : 0;
        
        return { used, available, percentage };
      }
      
      return { used: 0, available: 0, percentage: 0 };
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// Export singleton instance
export const indexedDBFileStorageService = new IndexedDBFileStorageService();
