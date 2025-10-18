import React from 'react';

import type { BackupInfo } from '../types';
import { hasValidWanData } from '../types';

interface OverviewTabProps {
  backupInfo: BackupInfo;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ backupInfo }) => {
  return (
    <div>
      <h3 className='font-bold text-xl mb-4'>Backup Information</h3>
      <table className='w-full text-left'>
        <tbody className='divide-y divide-gray-200'>
          <tr>
            <td className='px-4 py-2 font-semibold w-1/4'>Filename</td>
            <td className='px-4 py-2'>{backupInfo.filename}</td>
          </tr>
          {backupInfo.superIdentity && (
            <tr>
              <td className='px-4 py-2 font-semibold'>Site Name</td>
              <td className='px-4 py-2 text-lg font-bold text-blue-600'>
                {backupInfo.superIdentity}
              </td>
            </tr>
          )}
          <tr>
            <td className='px-4 py-2 font-semibold'>Type</td>
            <td className='px-4 py-2'>{backupInfo.type}</td>
          </tr>
          {backupInfo.version && (
            <tr>
              <td className='px-4 py-2 font-semibold'>Version</td>
              <td className='px-4 py-2'>{backupInfo.version}</td>
            </tr>
          )}
          {backupInfo.timestamp && (
            <tr>
              <td className='px-4 py-2 font-semibold'>Date Created</td>
              <td className='px-4 py-2'>{new Date(backupInfo.timestamp).toLocaleString()}</td>
            </tr>
          )}
          <tr>
            <td className='px-4 py-2 font-semibold'>Total Devices</td>
            <td className='px-4 py-2 text-2xl font-bold text-blue-600'>{backupInfo.deviceCount}</td>
          </tr>
          <tr>
            <td className='px-4 py-2  pl-8'> Switches & Gateways</td>
            <td className='px-4 py-2 text-xl font-semibold text-blue-500'>
              {backupInfo.switches.length}
            </td>
          </tr>
          <tr>
            <td className='px-4 py-2  pl-8'> Other Devices</td>
            <td className='px-4 py-2 text-xl font-semibold text-blue-500'>
              {backupInfo.otherDevices.length}
            </td>
          </tr>
          <tr>
            <td className='px-4 py-2 font-semibold'>WAN Interfaces</td>
            <td className='px-4 py-2 text-2xl font-bold text-green-600'>
              {backupInfo.wanConfigs.filter(wan => hasValidWanData(wan)).length}
            </td>
          </tr>
          <tr>
            <td className='px-4 py-2 font-semibold'>VLANs</td>
            <td className='px-4 py-2 text-2xl font-bold text-purple-600'>
              {backupInfo.vlanConfigs.length}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
