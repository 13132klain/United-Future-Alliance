import React, { useState, useEffect } from 'react';
import { indexedDBFileStorageService } from '../lib/indexedDBFileStorageService';
import { FileMetadata } from '../lib/indexedDBFileStorageService';

export default function FileStorageDebugger() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string>('');
  const [storageInfo, setStorageInfo] = useState<any>(null);

  useEffect(() => {
    loadFiles();
    loadStorageInfo();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      console.log('🔍 FileStorageDebugger: Loading all files...');
      
      // Get files from all categories
      const constitutionFiles = await indexedDBFileStorageService.getFilesByCategory('constitution');
      const researchFiles = await indexedDBFileStorageService.getFilesByCategory('research');
      const guideFiles = await indexedDBFileStorageService.getFilesByCategory('guide');
      const resourceFiles = await indexedDBFileStorageService.getFilesByCategory('resource');
      
      const allFiles = [...constitutionFiles, ...researchFiles, ...guideFiles, ...resourceFiles];
      console.log('🔍 FileStorageDebugger: Loaded files:', allFiles);
      
      setFiles(allFiles);
    } catch (error) {
      console.error('🔍 FileStorageDebugger: Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const info = await indexedDBFileStorageService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Error loading storage info:', error);
    }
  };

  const testUpload = async () => {
    try {
      setTestResult('Testing file upload...');
      
      // Create a test file
      const testContent = 'This is a test PDF content for debugging purposes.';
      const testFile = new File([testContent], 'test-constitution.pdf', { type: 'application/pdf' });
      
      console.log('🔍 FileStorageDebugger: Uploading test file:', testFile);
      
      const result = await indexedDBFileStorageService.uploadFile(
        testFile,
        'constitution',
        'test',
        {
          description: 'Test constitution file for debugging',
          author: 'Debug Tool',
          tags: ['test', 'debug', 'constitution']
        }
      );
      
      if (result.success) {
        console.log('🔍 FileStorageDebugger: Test upload successful:', result);
        setTestResult(`✅ Test file uploaded successfully with ID: ${result.fileId}`);
        
        // Reload files to show the new upload
        await loadFiles();
      } else {
        console.error('🔍 FileStorageDebugger: Test upload failed:', result.error);
        setTestResult(`❌ Test upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('🔍 FileStorageDebugger: Error in test upload:', error);
      setTestResult(`❌ Test upload error: ${error}`);
    }
  };

  const testRetrieval = async () => {
    try {
      setTestResult('Testing file retrieval...');
      
      console.log('🔍 FileStorageDebugger: Testing file retrieval...');
      const constitutionFiles = await indexedDBFileStorageService.getFilesByCategory('constitution');
      console.log('🔍 FileStorageDebugger: Retrieved constitution files:', constitutionFiles);
      
      setTestResult(`✅ Retrieved ${constitutionFiles.length} constitution files`);
    } catch (error) {
      console.error('🔍 FileStorageDebugger: Error in test retrieval:', error);
      setTestResult(`❌ Test retrieval error: ${error}`);
    }
  };

  const clearAllFiles = async () => {
    if (window.confirm('Are you sure you want to clear all files? This action cannot be undone.')) {
      try {
        setTestResult('Clearing all files...');
        await indexedDBFileStorageService.clearAllFiles();
        setTestResult('✅ All files cleared successfully');
        await loadFiles();
      } catch (error) {
        console.error('Error clearing files:', error);
        setTestResult(`❌ Error clearing files: ${error}`);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">File Storage Debugger</h3>
        <p className="text-yellow-700">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-900 mb-4">File Storage Debugger</h3>
      
      <div className="space-y-4">
        {/* Storage Info */}
        {storageInfo && (
          <div className="bg-white p-3 rounded border">
            <h4 className="font-semibold mb-2">Storage Information:</h4>
            <p className="text-sm">
              <strong>Used:</strong> {formatFileSize(storageInfo.used)}<br/>
              <strong>Available:</strong> {formatFileSize(storageInfo.available)}<br/>
              <strong>Usage:</strong> {storageInfo.percentage.toFixed(2)}%
            </p>
          </div>
        )}

        {/* Files List */}
        <div>
          <p className="text-yellow-700 mb-2">
            <strong>Total Files:</strong> {files.length}
          </p>
          {files.length > 0 ? (
            <div className="bg-white p-3 rounded border max-h-64 overflow-y-auto">
              <h4 className="font-semibold mb-2">Files by Category:</h4>
              {files.map((file, index) => (
                <div key={file.id || index} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                  <p><strong>ID:</strong> {file.id}</p>
                  <p><strong>Name:</strong> {file.originalName}</p>
                  <p><strong>Category:</strong> {file.category}</p>
                  <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
                  <p><strong>Upload Date:</strong> {new Date(file.uploadDate).toLocaleString()}</p>
                  <p><strong>Downloads:</strong> {file.downloadCount}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-500">No files found in storage</p>
            </div>
          )}
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <button
            onClick={testUpload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Upload
          </button>
          
          <button
            onClick={testRetrieval}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-2"
          >
            Test Retrieval
          </button>
          
          <button
            onClick={loadFiles}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ml-2"
          >
            Refresh Files
          </button>
          
          <button
            onClick={clearAllFiles}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
          >
            Clear All Files
          </button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="p-3 bg-white rounded border">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

