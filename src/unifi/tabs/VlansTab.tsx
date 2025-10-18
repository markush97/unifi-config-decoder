import React from 'react';

import type { VlanConfig } from '../types';

interface VlansTabProps {
  vlanConfigs: VlanConfig[];
}

export const VlansTab: React.FC<VlansTabProps> = ({ vlanConfigs }) => {
  if (vlanConfigs.length === 0) {
    return <div className='text-center text-gray-500 py-8'>No VLAN configurations found</div>;
  }

  return (
    <div>
      <h3 className='font-bold text-xl mb-4'>VLAN Configurations</h3>
      <div className='overflow-x-auto rounded-lg shadow-sm max-h-[600px] overflow-y-auto'>
        <table className='w-full text-xs border-collapse bg-white dark:bg-gray-800'>
          <thead className='sticky top-0 z-10'>
            <tr className='bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-700/80 border-b-2 border-gray-300 dark:border-gray-600'>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-24'>
                VLAN ID
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200'>
                Name
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-32'>
                Purpose
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-40'>
                IP Subnet
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-32'>
                Gateway Type
              </th>
              <th className='px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-200 w-24'>
                Status
              </th>
              <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200'>
                DHCP Range
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
            {vlanConfigs.map((vlan, idx) => (
              <tr
                key={vlan.name || `vlan-${idx}`}
                className='transition-colors hover:bg-blue-50 dark:hover:bg-gray-700/50'
              >
                <td className='px-3 py-2'>
                  <span className='inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-mono font-semibold'>
                    {vlan.vlan}
                  </span>
                </td>
                <td className='px-3 py-2 font-medium text-gray-800 dark:text-gray-200'>
                  {vlan.name}
                </td>
                <td className='px-3 py-2 text-gray-600 dark:text-gray-400 capitalize'>
                  {vlan.purpose || '-'}
                </td>
                <td className='px-3 py-2 font-mono text-gray-700 dark:text-gray-300'>
                  {vlan.ip_subnet || '-'}
                </td>
                <td className='px-3 py-2 capitalize text-gray-700 dark:text-gray-300'>
                  {vlan.gateway_type || '-'}
                </td>
                <td className='px-3 py-2 text-center'>
                  {vlan.enabled ? (
                    <span className='inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-2 py-1 rounded font-medium'>
                      Enabled
                    </span>
                  ) : (
                    <span className='inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded font-medium'>
                      Disabled
                    </span>
                  )}
                </td>
                <td className='px-3 py-2 font-mono text-gray-700 dark:text-gray-300'>
                  {vlan.dhcpd_start && vlan.dhcpd_stop
                    ? `${vlan.dhcpd_start} - ${vlan.dhcpd_stop}`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
