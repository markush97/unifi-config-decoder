import type { RefObject } from 'react';
import React from 'react';

interface FileUploadProps {
  fileInputRef: RefObject<HTMLInputElement>;
  isDragging: boolean;
  isProcessing: boolean;
  hasConfigDecoded: boolean;
  onFileChange: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDownloadZip: () => void;
  onDownloadMongoDump: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  fileInputRef,
  isDragging,
  isProcessing,
  hasConfigDecoded,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onDownloadZip,
  onDownloadMongoDump,
}) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 bg-white dark:bg-gray-800'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role='button'
      tabIndex={0}
      aria-label='Drag and drop area for .unf files'
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
    >
      {/* Hidden file input */}
      <input
        type='file'
        accept='.unf'
        ref={fileInputRef}
        onChange={onFileChange}
        className='hidden'
      />

      {/* Custom styled browse button */}
      <div className='text-center mb-4'>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
        >
          {isProcessing ? 'Processing...' : '📂 Choose .unf file'}
        </button>
      </div>

      <p className='text-sm text-gray-500 mb-4 text-center'>
        {isDragging
          ? '📁 Drop your .unf file here'
          : 'Select a .unf file or drag and drop it here - it will be automatically analyzed'}
      </p>

      <div className='flex gap-2 flex-wrap justify-center'>
        <button
          className={`px-4 py-2 rounded-lg shadow transition-colors duration-200 font-medium ${
            hasConfigDecoded && !isProcessing
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
          }`}
          onClick={onDownloadZip}
          disabled={!hasConfigDecoded || isProcessing}
          title={
            !hasConfigDecoded
              ? 'Please decode a config file first'
              : 'Download processed files as ZIP'
          }
        >
          📦 Download ZIP
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow transition-colors duration-200 font-medium ${
            hasConfigDecoded && !isProcessing
              ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
          }`}
          onClick={onDownloadMongoDump}
          disabled={!hasConfigDecoded || isProcessing}
          title={
            !hasConfigDecoded
              ? 'Please decode a config file first'
              : 'Download readable config database as JSON'
          }
        >
          📄 Download readable config-database (JSON)
        </button>
      </div>
    </div>
  );
};
