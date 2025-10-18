import React from 'react';

interface StatusMessageProps {
  status: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ status }) => {
  if (!status) return null;

  return (
    <div
      className={`p-4 rounded shadow ${
        status.includes('❌')
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200'
          : status.includes('✅')
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
      }`}
    >
      {status}
    </div>
  );
};
