import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, X, CheckCircle, AlertCircle, Users, Calendar, BookOpen, TrendingUp } from 'lucide-react';
import { indexedDBFileStorageService, FileMetadata } from '../../lib/indexedDBFileStorageService';

interface ResearchManagerProps {
  onClose: () => void;
  onActivityUpdate?: (type: string, action: string, item: string) => void;
}

export default function ResearchManager({ onActivityUpdate }: ResearchManagerProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [researchCategory, setResearchCategory] = useState<string>('economic');
  const [researchType, setResearchType] = useState<string>('study');
  const [currentFiles, setCurrentFiles] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fileStats, setFileStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    filesByCategory: {} as Record<string, number>
  });
  const [uniqueAuthors, setUniqueAuthors] = useState<Set<string>>(new Set());
  const [monthlyDownloads, setMonthlyDownloads] = useState(0);

  // Load research files on component mount
  useEffect(() => {
    loadCurrentFiles();
    loadFileStats();
  }, []);

  const loadCurrentFiles = async () => {
    try {
      setIsLoading(true);
      const files = await indexedDBFileStorageService.getFilesByCategory('research');
      setCurrentFiles(files);
      
      // Extract unique authors
      const authors = new Set(files.map(file => file.author).filter(Boolean));
      setUniqueAuthors(authors);
      
      // Calculate monthly downloads (files uploaded in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthlyFiles = files.filter(file => 
        new Date(file.uploadDate) >= thirtyDaysAgo
      );
      
      const monthlyDownloadCount = monthlyFiles.reduce((total, file) => total + file.downloadCount, 0);
      setMonthlyDownloads(monthlyDownloadCount);
    } catch (error) {
      console.error('Failed to load research files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFileStats = async () => {
    try {
      const stats = await indexedDBFileStorageService.getFileStats();
      setFileStats(stats);
    } catch (error) {
      console.error('Failed to load file stats:', error);
    }
  };

  // Research categories configuration

  const categories = [
    { id: 'economic', label: 'Economic Development', description: 'Economic growth and development studies' },
    { id: 'social', label: 'Social Policy', description: 'Healthcare, education, and social programs' },
    { id: 'environmental', label: 'Environmental Impact', description: 'Climate change and sustainability' },
    { id: 'governance', label: 'Governance & Transparency', description: 'Public administration and reform' }
  ];

  const researchTypes = [
    { id: 'study', label: 'Research Study', description: 'Comprehensive research study' },
    { id: 'report', label: 'Research Report', description: 'Detailed analysis report' },
    { id: 'brief', label: 'Policy Brief', description: 'Concise policy recommendations' },
    { id: 'analysis', label: 'Policy Analysis', description: 'In-depth policy evaluation' }
  ];

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
        'research',
        researchCategory,
        {
          description: `${categories.find(c => c.id === researchCategory)?.label} - ${researchTypes.find(t => t.id === researchType)?.label}`,
          author: 'UFA Research Team',
          tags: ['research', researchCategory, researchType, 'policy']
        }
      );

      if (result.success) {
        setUploadSuccess(true);
        setUploadedFile(null);
        onActivityUpdate?.('research', 'Uploaded', `${categories.find(c => c.id === researchCategory)?.label} - ${researchTypes.find(t => t.id === researchType)?.label}`);
        
        // Reload current files and stats
        await loadCurrentFiles();
        await loadFileStats();
        
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

  const handleDownload = async (fileId: string) => {
    try {
      const result = await indexedDBFileStorageService.downloadFile(fileId);
      if (result.success) {
        // Download is automatically triggered by the service
        onActivityUpdate?.('research', 'Downloaded', 'Research Document');
        
        // Reload current files and stats to update download count
        await loadCurrentFiles();
        await loadFileStats();
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
        <BookOpen className="w-7 h-7 text-green-600" /> Research Library Management
      </h2>

      {/* Research Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Studies</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {fileStats.totalFiles}
          </p>
          <p className="text-sm text-gray-600">Research publications</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Monthly Downloads</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {monthlyDownloads.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Last 30 days</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Active Researchers</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {uniqueAuthors.size}
          </p>
          <p className="text-sm text-gray-600">Contributing authors</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Categories</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {categories.length}
          </p>
          <p className="text-sm text-gray-600">Research areas</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Research by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-1">{category.label}</h4>
              <p className="text-2xl font-bold text-green-600">
                {fileStats.filesByCategory[category.id] || 0}
              </p>
              <p className="text-sm text-gray-600">studies</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload New Research */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Research</h3>
        
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Research uploaded successfully!</p>
          </div>
        )}

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Research Category</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="researchCategory"
                  value={category.id}
                  checked={researchCategory === category.id}
                  onChange={(e) => setResearchCategory(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{category.label}</p>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Research Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Research Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {researchTypes.map((type) => (
              <label key={type.id} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="researchType"
                  value={type.id}
                  checked={researchType === type.id}
                  onChange={(e) => setResearchType(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{type.label}</p>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-green-600" />
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
                <p className="text-lg font-medium text-gray-900">Drop your research PDF here</p>
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
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Research
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

      {/* Current Research Files */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Research Files</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : currentFiles.length > 0 ? (
          <div className="space-y-4">
            {currentFiles.map((file) => (
              <div key={file.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{file.originalName}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Category: {categories.find(c => c.id === file.subcategory)?.label || file.subcategory}</span>
                      <span>Size: {indexedDBFileStorageService.formatFileSize(file.size)}</span>
                      <span>Downloads: {file.downloadCount}</span>
                      <span>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</span>
                    </div>
                    {file.description && (
                      <p className="text-sm text-gray-600 mt-2">{file.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(file.id)}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No research files uploaded yet.</p>
            <p className="text-sm text-gray-500">Upload files to get started.</p>
          </div>
        )}
      </div>

      {/* Research Guidelines */}
      <div className="mt-8 bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Research Upload Guidelines</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Only PDF files are accepted</li>
          <li>• File size should not exceed 50MB</li>
          <li>• Include proper citations and references</li>
          <li>• Ensure research follows academic standards</li>
          <li>• Provide clear abstracts and summaries</li>
          <li>• Research will be reviewed before publication</li>
          <li>• Authors must have proper credentials</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Analytics
          </button>
          <button className="bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            Manage Authors
          </button>
          <button className="bg-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            View Statistics
          </button>
        </div>
      </div>
    </div>
  );
}
