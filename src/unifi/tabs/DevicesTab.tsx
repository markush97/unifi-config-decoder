import React from 'react';

import type { DeviceRecord } from '../types';

interface DevicesTabProps {
  devices: DeviceRecord[];
}

export const DevicesTab: React.FC<DevicesTabProps> = ({ devices }) => {
  if (devices.length === 0) {
    return <div className='text-center text-gray-500 py-8'>No other devices found</div>;
  }

  return (
    <div>
      <h3 className='font-bold text-xl mb-4'>Other Devices</h3>
      <div className='overflow-x-auto rounded-lg shadow-sm max-h-[600px] overflow-y-auto'>
        <table className='w-full text-xs border-collapse bg-white dark:bg-gray-800'>
          <thead className='sticky top-0 z-10'>
            <tr className='bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-700/80 border-b-2 border-gray-300 dark:border-gray-600'>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200'>
                Name
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-32'>
                Model
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-40'>
                MAC
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-32'>
                IP
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-40'>
                Type
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
            {devices.map((device, idx) => (
              <tr
                key={device.mac || `device-${idx}`}
                className='transition-colors hover:bg-blue-50 dark:hover:bg-gray-700/50'
              >
                <td className='px-3 py-2 font-medium text-gray-800 dark:text-gray-200'>
                  {device.name || 'N/A'}
                </td>
                <td className='px-3 py-2 text-gray-700 dark:text-gray-300'>
                  {device.model || 'N/A'}
                </td>
                <td className='px-3 py-2 font-mono text-gray-700 dark:text-gray-300'>
                  {device.mac || 'N/A'}
                </td>
                <td className='px-3 py-2 font-mono text-gray-700 dark:text-gray-300'>
                  {device.ip || 'N/A'}
                </td>
                <td className='px-3 py-2'>
                  <span
                    className={`inline-block px-2 py-1 rounded font-medium ${
                      device.type === 'uap'
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200'
                        : device.type === 'uvc'
                          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {device.type === 'uap'
                      ? 'Access Point'
                      : device.type === 'uvc'
                        ? 'Camera'
                        : device.type || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
