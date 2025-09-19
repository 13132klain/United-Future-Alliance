import React, { useState } from 'react';
import { Upload, Download, FileText, X, CheckCircle, AlertCircle, Users, Calendar, MapPin } from 'lucide-react';

interface ActionToolkitManagerProps {
  onClose: () => void;
  onActivityUpdate?: (type: string, action: string, item: string) => void;
}

export default function ActionToolkitManager({ onActivityUpdate }: ActionToolkitManagerProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toolkitType, setToolkitType] = useState<string>('complete');

  // Mock current action toolkit info
  const currentToolkit = {
    name: 'UFA Action Toolkit 2024.pdf',
    size: '15.2 MB',
    uploadDate: '2024-01-20',
    downloadCount: 3421,
    version: '2.1'
  };

  // Mock toolkit statistics
  const toolkitStats = {
    totalDownloads: 3421,
    monthlyDownloads: 456,
    userEngagement: 78,
    lastUpdate: '2024-01-20'
  };

  const toolkitTypes = [
    { id: 'complete', label: 'Complete Toolkit', description: 'All resources in one package' },
    { id: 'templates', label: 'Template Documents', description: 'Letters, petitions, forms' },
    { id: 'guides', label: 'Planning Guides', description: 'Strategy and planning resources' },
    { id: 'directory', label: 'Contact Directory', description: 'Government and organization contacts' },
    { id: 'legal', label: 'Legal Resources', description: 'Rights and legal information' }
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
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setUploadedFile(null);
      onActivityUpdate?.('action-toolkit', 'Updated', `${toolkitTypes.find(t => t.id === toolkitType)?.label}`);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleDownload = () => {
    // Simulate download
    alert('Downloading current Action Toolkit...');
    onActivityUpdate?.('action-toolkit', 'Downloaded', 'Action Toolkit');
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
        <FileText className="w-7 h-7 text-blue-600" /> Action Toolkit Management
      </h2>

      {/* Toolkit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Downloads</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {toolkitStats.totalDownloads.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">All time</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Monthly Downloads</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {toolkitStats.monthlyDownloads.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">This month</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">User Engagement</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {toolkitStats.userEngagement}%
          </p>
          <p className="text-sm text-gray-600">Active users</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Version</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {currentToolkit.version}
          </p>
          <p className="text-sm text-gray-600">Current version</p>
        </div>
      </div>

      {/* Current Toolkit Info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Action Toolkit</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">File Name</p>
            <p className="font-medium text-gray-900">{currentToolkit.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">File Size</p>
            <p className="font-medium text-gray-900">{currentToolkit.size}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Upload Date</p>
            <p className="font-medium text-gray-900">{currentToolkit.uploadDate}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Total Downloads</p>
          <p className="font-medium text-gray-900">{currentToolkit.downloadCount.toLocaleString()}</p>
        </div>
        <button
          onClick={handleDownload}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Current Version
        </button>
      </div>

      {/* Upload New Version */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Action Toolkit</h3>
        
        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Action toolkit updated successfully!</p>
          </div>
        )}

        {/* Toolkit Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Toolkit Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {toolkitTypes.map((type) => (
              <label key={type.id} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="toolkitType"
                  value={type.id}
                  checked={toolkitType === type.id}
                  onChange={(e) => setToolkitType(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-blue-600" />
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
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <li>• File size should not exceed 50MB</li>
          <li>• Ensure the toolkit includes all necessary resources</li>
          <li>• Update version numbers for new releases</li>
          <li>• The file will be immediately available for download by users</li>
          <li>• Previous versions will be archived automatically</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Analytics
          </button>
          <button className="bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Feedback
          </button>
          <button className="bg-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Usage Map
          </button>
        </div>
      </div>
    </div>
  );
}
