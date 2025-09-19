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
  fileData: string; // Base64 encoded file data
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

class LocalFileStorageService {
  private readonly STORAGE_KEY = 'ufa_file_storage';
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_TYPES = ['application/pdf'];

  /**
   * Upload a file to local storage (localStorage with base64 encoding)
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

      // Generate unique ID and filename
      const fileId = this.generateFileId();
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${category}_${timestamp}.${fileExtension}`;
      const storagePath = `${category}/${fileName}`;

      // Convert file to base64
      const fileData = await this.fileToBase64(file);

      // Create file metadata
      const fileMetadata: FileMetadata = {
        id: fileId,
        name: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        downloadURL: `#download-${fileId}`, // Local download URL
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
        fileData, // Store the actual file data
        ...metadata
      };

      // Save to localStorage
      const existingFiles = this.getAllFiles();
      existingFiles.push(fileMetadata);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingFiles));

      console.log('✅ File uploaded successfully to local storage:', {
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
      const allFiles = this.getAllFiles();
      return allFiles
        .filter(file => file.category === category)
        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
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
      const allFiles = this.getAllFiles();
      return allFiles.find(file => file.id === fileId) || null;
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

      // Increment download count
      const allFiles = this.getAllFiles();
      const fileIndex = allFiles.findIndex(f => f.id === fileId);
      if (fileIndex !== -1) {
        allFiles[fileIndex].downloadCount += 1;
        allFiles[fileIndex].lastModified = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allFiles));
      }

      // Create download URL
      const downloadURL = this.createDownloadURL(file);
      
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
   * Delete a file from local storage
   */
  async deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const allFiles = this.getAllFiles();
      const filteredFiles = allFiles.filter(file => file.id !== fileId);
      
      if (filteredFiles.length === allFiles.length) {
        return { success: false, error: 'File not found' };
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredFiles));
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
      const allFiles = this.getAllFiles();
      
      let totalFiles = allFiles.length;
      let totalDownloads = 0;
      const filesByCategory: Record<string, number> = {};

      allFiles.forEach(file => {
        totalDownloads += file.downloadCount || 0;
        
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
  validateFile(file: File, allowedTypes: string[] = this.ALLOWED_TYPES, maxSizeMB: number = 50): {
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
   * Get all files from localStorage
   */
  private getAllFiles(): FileMetadata[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get files from localStorage:', error);
      return [];
    }
  }

  /**
   * Generate unique file ID
   */
  private generateFileId(): string {
    return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Convert file to base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:application/pdf;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Create download URL for file
   */
  private createDownloadURL(file: FileMetadata): string {
    // Create a blob URL for download
    const byteCharacters = atob(file.fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.type });
    
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
   * Clear all files (for testing/reset)
   */
  clearAllFiles(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑️ All files cleared from local storage');
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const used = stored ? new Blob([stored]).size : 0;
      const available = 5 * 1024 * 1024; // 5MB typical localStorage limit
      const percentage = (used / available) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// Export singleton instance
export const localFileStorageService = new LocalFileStorageService();
