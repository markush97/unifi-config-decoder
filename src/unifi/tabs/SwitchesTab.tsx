import React, { useState } from 'react';

import { PortDetailsTable } from '../components/PortDetailsTable';
import type { DeviceRecord, PortConfig, NetworkConfig } from '../types';

interface SwitchesTabProps {
  devices: DeviceRecord[];
  portConfigs: PortConfig[];
  allNetworkConfs: NetworkConfig[];
  defaultVlanId?: string;
}

export const SwitchesTab: React.FC<SwitchesTabProps> = ({
  devices,
  portConfigs,
  allNetworkConfs,
  defaultVlanId,
}) => {
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);

  const toggleDevice = (mac: string) => {
    setExpandedDevice(expandedDevice === mac ? null : mac);
  };

  if (devices.length === 0) {
    return <div className='text-center text-gray-500 py-8'>No switches or gateways found</div>;
  }

  return (
    <div>
      <h3 className='font-bold text-xl mb-4'>Switches & Gateways</h3>
      <div className='space-y-2'>
        {devices.map((device, idx) => {
          const isExpanded = expandedDevice === device.mac;

          return (
            <div
              key={device.mac || idx}
              className='border rounded bg-white dark:bg-gray-700 overflow-hidden'
            >
              {/* Device Header - Clickable */}
              <div
                className='px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between'
                onClick={() => toggleDevice(device.mac || '')}
                role='button'
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`Toggle details for ${device.name || 'Unknown Device'}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDevice(device.mac || '');
                  }
                }}
              >
                <div className='flex items-center gap-4 flex-1'>
                  <div className='flex-1'>
                    <div className='font-medium text-lg'>{device.name || 'N/A'}</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {device.model || 'N/A'} • {device.mac || 'N/A'} • {device.ip || 'N/A'}
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        device.type === 'ugw' || device.type === 'usg'
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}
                    >
                      {device.type === 'ugw' || device.type === 'usg'
                        ? 'Gateway'
                        : device.type === 'usw'
                          ? 'Switch'
                          : device.type || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className='ml-4'>
                  <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </div>
              </div>

              {/* Port Details - Expandable */}
              {isExpanded && device.port_overrides && (
                <div className='px-4 pb-4 border-t dark:border-gray-600'>
                  <PortDetailsTable
                    portOverrides={
                      device.port_overrides?.map(po => ({
                        port_idx: (po.port_idx as number) || 0,
                        name: po.name as string | undefined,
                        poe_mode: (po as Record<string, unknown>).poe_mode as string | undefined,
                        native_networkconf_id: (po as Record<string, unknown>)
                          .native_networkconf_id as string | undefined,
                        excluded_networkconf_ids: (po as Record<string, unknown>)
                          .excluded_networkconf_ids as string[] | undefined,
                        tagged_vlan_mgmt: (po as Record<string, unknown>).tagged_vlan_mgmt as
                          | string
                          | undefined,
                        portconf_id: po.portconf_id as string | undefined,
                        forward: (po as Record<string, unknown>).forward as string | undefined,
                        op_mode: (po as Record<string, unknown>).op_mode as string | undefined,
                        setting_preference: (po as Record<string, unknown>).setting_preference as
                          | string
                          | undefined,
                      })) || []
                    }
                    portConfigs={portConfigs.map(pc => ({
                      _id: pc._id || '',
                      name: pc.name || '',
                      poe_mode: (pc as Record<string, unknown>).poe_mode as string | undefined,
                      native_networkconf_id: pc.native_networkconf_id,
                      excluded_networkconf_ids: (pc as Record<string, unknown>)
                        .excluded_networkconf_ids as string[] | undefined,
                      tagged_vlan_mgmt: (pc as Record<string, unknown>).tagged_vlan_mgmt as
                        | string
                        | undefined,
                      forward: (pc as Record<string, unknown>).forward as string | undefined,
                      op_mode: (pc as Record<string, unknown>).op_mode as string | undefined,
                      setting_preference: (pc as Record<string, unknown>).setting_preference as
                        | string
                        | undefined,
                    }))}
                    allNetworkConfs={allNetworkConfs.map(nc => ({
                      _id: nc._id || '',
                      name: nc.name,
                      vlan: nc.vlan,
                      purpose: nc.purpose,
                      ip_subnet: nc.ip_subnet,
                      vlan_enabled: (nc as Record<string, unknown>).vlan_enabled as
                        | boolean
                        | undefined,
                    }))}
                    portTable={((device.port_table as unknown[]) || []).map((pt: unknown) => ({
                      port_idx: (pt as Record<string, unknown>).port_idx as number,
                      media: (pt as Record<string, unknown>).media as string | undefined,
                      speed_caps: (pt as Record<string, unknown>).speed_caps as number | undefined,
                      port_poe: (pt as Record<string, unknown>).port_poe as boolean | undefined,
                      poe_caps: (pt as Record<string, unknown>).poe_caps as number | undefined,
                      speed: (pt as Record<string, unknown>).speed as number | undefined,
                    }))}
                    defaultVlanId={defaultVlanId}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
