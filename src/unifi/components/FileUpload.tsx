import type { RefObject } from 'react';
import React from 'react';

interface FileUploadProps {
  fileInputRef: RefObject<HTMLInputElement>;
  isDragging: boolean;
  isProcessing: boolean;
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
      <input
        type='file'
        accept='.unf'
        ref={fileInputRef}
        onChange={onFileChange}
        className='border p-2 rounded w-full mb-4'
      />
      <p className='text-sm text-gray-500 mb-4'>
        {isDragging
          ? '📁 Drop your .unf file here'
          : '📂 Select a .unf file or drag and drop it here - it will be automatically analyzed'}
      </p>
      <div className='flex gap-2 flex-wrap'>
        <button
          className='bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={onDownloadZip}
          disabled={isProcessing}
        >
          Download ZIP
        </button>
        <button
          className='bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={onDownloadMongoDump}
          disabled={isProcessing}
        >
          Download readable config-database (JSON)
        </button>
      </div>
    </div>
  );
};
