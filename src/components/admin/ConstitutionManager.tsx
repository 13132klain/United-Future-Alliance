import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { indexedDBFileStorageService, FileMetadata } from '../../lib/indexedDBFileStorageService';

interface ConstitutionManagerProps {
  onClose: () => void;
  onActivityUpdate?: (type: string, action: string, item: string) => void;
}

export default function ConstitutionManager({ onActivityUpdate }: ConstitutionManagerProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current constitution file on component mount
  useEffect(() => {
    loadCurrentFile();
  }, []);

  const loadCurrentFile = async () => {
    try {
      setIsLoading(true);
      const files = await indexedDBFileStorageService.getFilesByCategory('constitution');
      if (files.length > 0) {
        setCurrentFile(files[0]); // Get the most recent file
      }
    } catch (error) {
      console.error('Failed to load constitution file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock current constitution file info (fallback)
  const currentConstitution = {
    name: 'Constitution of Kenya 2010 Guide.pdf',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    downloadCount: 1247
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedFile(file);
      } else {
        alert('Please upload a PDF file only.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedFile(file);
      } else {
        alert('Please upload a PDF file only.');
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    // Validate file
    const validation = indexedDBFileStorageService.validateFile(uploadedFile);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    
    setIsUploading(true);
    
    try {
      const result = await indexedDBFileStorageService.uploadFile(
        uploadedFile,
        'constitution',
        'guide',
        {
          description: 'Constitution of Kenya 2010 Guide',
          author: 'UFA Legal Team',
          tags: ['constitution', 'kenya', 'legal', 'guide']
        }
      );

      if (result.success) {
        setUploadSuccess(true);
        setUploadedFile(null);
        onActivityUpdate?.('constitution', 'Updated', 'Constitution Guide');
        
        // Reload current file
        await loadCurrentFile();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!currentFile) {
      alert('No constitution file available for download.');
      return;
    }

    try {
      const result = await indexedDBFileStorageService.downloadFile(currentFile.id);
      if (result.success && result.downloadURL) {
        // Download is automatically triggered by the service
        onActivityUpdate?.('constitution', 'Downloaded', 'Constitution Guide');
        
        // Reload current file to update download count
        await loadCurrentFile();
      } else {
        alert(`Download failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <FileText className="w-7 h-7 text-red-600" /> Constitution Management
      </h2>

      {/* Current Constitution Info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Constitution Guide</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : currentFile ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">File Name</p>
                <p className="font-medium text-gray-900">{currentFile.originalName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">File Size</p>
                <p className="font-medium text-gray-900">{indexedDBFileStorageService.formatFileSize(currentFile.size)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Upload Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(currentFile.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="font-medium text-gray-900">{currentFile.downloadCount.toLocaleString()}</p>
            </div>
            <button
              onClick={handleDownload}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Current Version
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No constitution file uploaded yet.</p>
            <p className="text-sm text-gray-500">Upload a file to get started.</p>
          </div>
        )}
      </div>

      {/* Upload New Version */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Constitution Guide</h3>
        
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Constitution guide updated successfully!</p>
          </div>
        )}

        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">{formatFileSize(uploadedFile.size)}</p>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 mx-auto"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Drop your PDF file here</p>
                <p className="text-gray-600">or click to browse</p>
              </div>
              <p className="text-sm text-gray-500">Only PDF files are accepted</p>
            </div>
          )}
        </div>

        {uploadedFile && (
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload New Version
                </>
              )}
            </button>
            <button
              onClick={() => setUploadedFile(null)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Upload Guidelines</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Only PDF files are accepted</li>
          <li>• File size should not exceed 10MB</li>
          <li>• Ensure the document is the latest version of the Constitution Guide</li>
          <li>• The file will be immediately available for download by users</li>
          <li>• Previous versions will be archived automatically</li>
        </ul>
      </div>
    </div>
  );
}
