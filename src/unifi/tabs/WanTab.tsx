import React from 'react';

import type { WanConfig } from '../types';
import { formatIPWithMask, hasValidWanData } from '../types';

interface WanTabProps {
  wanConfigs: WanConfig[];
}

export const WanTab: React.FC<WanTabProps> = ({ wanConfigs }) => {
  const validWanConfigs = wanConfigs.filter(wan => hasValidWanData(wan));

  if (validWanConfigs.length === 0) {
    return <div className='text-center text-gray-500 py-8'>No WAN configurations found</div>;
  }

  return (
    <div>
      <h3 className='font-bold text-xl mb-4'>WAN Configurations</h3>
      <div className='overflow-x-auto rounded-lg shadow-sm'>
        <table className='w-full text-xs border-collapse bg-white dark:bg-gray-800'>
          <thead>
            <tr className='bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-700/80 border-b-2 border-gray-300 dark:border-gray-600'>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200'>
                Name
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-32'>
                Type
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-40'>
                IP/Mask
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-32'>
                Gateway
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-32'>
                DNS 1
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-32'>
                DNS 2
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
            {validWanConfigs.map((wan, idx) => (
              <tr
                key={wan.name || `wan-${idx}`}
                className='transition-colors hover:bg-blue-50 dark:hover:bg-gray-700/50'
              >
                <td className='px-3 py-2 font-semibold text-blue-600 dark:text-blue-400'>
                  {wan.name}
                </td>
                <td className='px-3 py-2'>
                  {wan.wan_type ? (
                    <span className='inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 px-2 py-1 rounded font-medium'>
                      {wan.wan_type}
                    </span>
                  ) : (
                    <span className='text-gray-400'>-</span>
                  )}
                </td>
                <td className='px-3 py-2 font-mono text-green-600 dark:text-green-400 font-semibold'>
                  {formatIPWithMask(wan.wan_ip, wan.wan_netmask)}
                </td>
                <td className='px-3 py-2 font-mono text-gray-700 dark:text-gray-300'>
                  {wan.wan_gateway || '-'}
                </td>
                <td className='px-3 py-2 font-mono text-gray-700 dark:text-gray-300'>
                  {wan.wan_dns1 || '-'}
                </td>
                <td className='px-3 py-2 font-mono text-gray-700 dark:text-gray-300'>
                  {wan.wan_dns2 || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
