import Tippy from '@tippyjs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';

import { compareObjectId } from '../../utils/objectIdUtils';

interface PortOverride {
  port_idx: number;
  name?: string;
  poe_mode?: string;
  native_networkconf_id?: string;
  excluded_networkconf_ids?: string[];
  tagged_vlan_mgmt?: string;
  portconf_id?: string;
  forward?: string;
  op_mode?: string;
  setting_preference?: string;
}

interface PortTableEntry {
  port_idx: number;
  media?: string;
  speed_caps?: number;
  port_poe?: boolean;
  poe_caps?: number;
  speed?: number;
}

interface PortConfig {
  _id: string;
  name: string;
  poe_mode?: string;
  native_networkconf_id?: string;
  excluded_networkconf_ids?: string[];
  tagged_vlan_mgmt?: string;
  forward?: string;
  op_mode?: string;
  setting_preference?: string;
}

interface NetworkConf {
  _id: string;
  name?: string;
  vlan?: number;
  purpose?: string;
  ip_subnet?: string;
  vlan_enabled?: boolean;
  [key: string]: unknown;
}

interface PortDetailsTableProps {
  portOverrides: PortOverride[];
  portConfigs: PortConfig[];
  allNetworkConfs: NetworkConf[];
  portTable: PortTableEntry[];
  defaultVlanId?: string; // Default VLAN ID (usually VLAN 1)
}

export const PortDetailsTable: React.FC<PortDetailsTableProps> = ({
  portOverrides,
  portConfigs,
  allNetworkConfs,
  portTable,
  defaultVlanId,
}) => {
  // Helper to format speed from speed field
  const getMaxSpeed = (speed?: number): string => {
    if (!speed) return '1G';
    // speed is in Mbps
    if (speed >= 100000) return '100G';
    if (speed >= 40000) return '40G';
    if (speed >= 25000) return '25G';
    if (speed >= 10000) return '10G';
    if (speed >= 5000) return '5G';
    if (speed >= 2500) return '2.5G';
    if (speed >= 1000) return '1G';
    if (speed >= 100) return '100M';
    return '10M';
  };

  // Merge port_table with port_overrides and sort by port_idx
  const getAllPorts = () => {
    return portTable
      .map(portEntry => {
        const override = portOverrides.find(o => o.port_idx === portEntry.port_idx);
        return {
          portEntry,
          override,
        };
      })
      .sort((a, b) => a.portEntry.port_idx - b.portEntry.port_idx);
  };

  const getVlanTag = (vlanId: string): string | null => {
    // Handle both string _id and BSON ObjectId _id
    const networkConf = allNetworkConfs.find(n => compareObjectId(n._id, vlanId));

    if (networkConf && networkConf.vlan !== undefined) {
      return networkConf.vlan.toString();
    }
    return null;
  };

  const getVlanName = (vlanId: string): string | null => {
    // Handle both string _id and BSON ObjectId _id
    const networkConf = allNetworkConfs.find(n => compareObjectId(n._id, vlanId));

    if (networkConf && networkConf.name) {
      return networkConf.name;
    }
    return null;
  };

  const getVlanNameByTag = (vlanTag: string): string | null => {
    const networkConf = allNetworkConfs.find(n => n.vlan?.toString() === vlanTag);
    return networkConf?.name || null;
  };

  const renderTaggedVlans = (
    config: PortOverride | PortConfig | null | undefined
  ): React.ReactNode => {
    if (!config) {
      return <span className='text-gray-700 dark:text-gray-300'>Allow All</span>;
    }

    const taggedVlansStr = getTaggedVlans(config);

    // If it's "Allow All", "None", or "Unknown", just display as text
    if (
      taggedVlansStr === 'Allow All' ||
      taggedVlansStr === 'None' ||
      taggedVlansStr === 'Unknown'
    ) {
      return <span className='text-gray-700 dark:text-gray-300'>{taggedVlansStr}</span>;
    }

    // Split comma-separated VLAN tags and create tooltips for each
    const vlanTags = taggedVlansStr.split(', ');
    return (
      <span className='text-gray-700 dark:text-gray-300'>
        {vlanTags.map((tag, index) => {
          const vlanName = getVlanNameByTag(tag);
          return (
            <React.Fragment key={tag}>
              {index > 0 && ', '}
              {vlanName ? (
                <Tippy content={vlanName}>
                  <span className='cursor-help hover:text-blue-600 dark:hover:text-blue-400'>
                    {tag}
                  </span>
                </Tippy>
              ) : (
                <span>{tag}</span>
              )}
            </React.Fragment>
          );
        })}
      </span>
    );
  };

  const getTaggedVlans = (config: PortOverride | PortConfig): string => {
    const forward = config.forward || 'native';
    const taggedMgmt = config.tagged_vlan_mgmt || 'auto';

    // Native mode - no tagged VLANs
    if (forward === 'native') {
      return 'None';
    }

    // If tagged_vlan_mgmt is 'auto', it means "Allow All" regardless of forward mode
    if (taggedMgmt === 'auto') {
      return 'Allow All';
    }

    // Customize mode with specific VLAN management - check excluded networks
    if (forward === 'customize') {
      const excludedIds = config.excluded_networkconf_ids || [];
      const nativeId = config.native_networkconf_id;

      // All VLANs except excluded ones and the native VLAN are tagged
      const taggedVlans = allNetworkConfs
        .filter((v: NetworkConf) => !excludedIds.includes(v._id) && v._id !== nativeId)
        .map((v: NetworkConf) => (v.vlan !== undefined ? v.vlan.toString() : null))
        .filter((tag): tag is string => tag !== null)
        .sort((a: string, b: string) => parseInt(a) - parseInt(b));

      // Check if all VLANs (except native) are tagged
      const allVlansExceptNative = allNetworkConfs.filter(
        (v: NetworkConf) => v._id !== nativeId
      ).length;
      if (taggedVlans.length === allVlansExceptNative && taggedVlans.length > 0) {
        return 'Allow All';
      }

      return taggedVlans.length > 0 ? taggedVlans.join(', ') : 'None';
    }

    return 'Unknown';
  };

  const getPortConfig = (portconf_id?: string): PortConfig | undefined => {
    if (!portconf_id) return undefined;

    // Handle both string _id and BSON ObjectId _id
    return portConfigs.find(pc => compareObjectId(pc._id, portconf_id));
  };

  const isPortEnabled = (port?: PortOverride, portConfig?: PortConfig): boolean => {
    const config = portConfig || port;
    if (!config) return true; // Default to enabled if no config

    // Check if explicitly disabled
    if (config.setting_preference === 'disabled') return false;

    // If op_mode is present, it must be 'switch' or 'aggregate' to be enabled
    // If op_mode is missing, default to enabled (assume switch mode)
    if (config.op_mode) {
      return config.op_mode === 'switch' || config.op_mode === 'aggregate';
    }

    return true; // No op_mode means default switch mode (enabled)
  };

  const allPorts = getAllPorts();

  if (!portTable || portTable.length === 0) {
    return <div className='text-gray-500 text-sm py-2'>No ports available</div>;
  }

  return (
    <div className='mt-4 overflow-x-auto rounded-lg shadow-sm'>
      <table className='w-full text-xs border-collapse bg-white dark:bg-gray-800'>
        <thead>
          <tr className='bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-700/80 border-b-2 border-gray-300 dark:border-gray-600'>
            <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-4'>
              Port
            </th>
            <th className='px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-200 w-16'>
              Type/Speed
            </th>
            <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200'>
              Name
            </th>
            <th className='px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-200 w-38'>
              Profile
            </th>
            <th className='px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-200 w-16'>
              Status
            </th>
            <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-20'>
              PoE
            </th>
            <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 w-20'>
              VLAN
            </th>
            <th className='px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200'>
              Tagged VLANs
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
          {allPorts.map(({ portEntry, override }) => {
            const portConfig = override ? getPortConfig(override.portconf_id) : undefined;
            const config = portConfig || override;
            const enabled = isPortEnabled(override, portConfig);
            const portKey = `port-${portEntry.port_idx}-${override?.portconf_id || 'default'}`;

            // Use default VLAN 1 if no override
            const nativeVlanId = config?.native_networkconf_id || defaultVlanId;

            return (
              <tr
                key={portKey}
                className={`transition-colors hover:bg-blue-50 dark:hover:bg-gray-700/50 ${
                  !enabled ? 'opacity-40 bg-gray-50 dark:bg-gray-900/50' : ''
                }`}
              >
                <td className='px-3 py-2 font-mono font-semibold text-gray-900 dark:text-gray-100'>
                  {portEntry.port_idx}
                </td>
                <td className='px-6 py-2'>
                  <div className='flex justify-between items-center'>
                    <span className='font-semibold text-blue-600 dark:text-blue-400'>
                      {portEntry.media || 'GE'}
                    </span>
                    <span className='italic text-gray-500 dark:text-gray-400 text-xs'>
                      {getMaxSpeed(portEntry.speed)}
                    </span>
                  </div>
                </td>
                <td className='px-3 py-2 text-gray-800 dark:text-gray-200'>
                  {override?.name || portConfig?.name || `Port ${portEntry.port_idx}`}
                </td>
                <td className='px-3 py-2 text-center'>
                  {portConfig ? (
                    <span className='text-xs  text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded'>
                      {portConfig.name}
                    </span>
                  ) : (
                    <span className='text-gray-400 text-xs italic'>Default</span>
                  )}
                </td>
                <td className='px-3 py-2 text-center'>
                  <Tippy content={enabled ? 'Enabled' : 'Disabled'}>
                    <div className='flex justify-center'>
                      {enabled ? (
                        <CheckCircle2 className='w-4 h-4 text-green-600 dark:text-green-400' />
                      ) : (
                        <XCircle className='w-4 h-4 text-gray-400 dark:text-gray-500' />
                      )}
                    </div>
                  </Tippy>
                </td>
                <td className='px-3 py-2'>
                  {portEntry.port_poe ? (
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        config?.poe_mode === 'auto' ||
                        !config?.poe_mode ||
                        config?.poe_mode === 'pasv24'
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {config?.poe_mode === 'auto' || !config?.poe_mode
                        ? 'Auto'
                        : config?.poe_mode === 'pasv24'
                          ? 'Passive 24V'
                          : config?.poe_mode === 'off'
                            ? 'Off'
                            : config.poe_mode}
                    </span>
                  ) : (
                    <span className='text-gray-400 text-xs'>N/A</span>
                  )}
                </td>
                <td className='px-3 py-2'>
                  {nativeVlanId && getVlanName(nativeVlanId) ? (
                    <Tippy content={getVlanName(nativeVlanId) || ''}>
                      <span className='font-semibold text-blue-600 dark:text-blue-400 cursor-help bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded'>
                        {getVlanTag(nativeVlanId) || '1'}
                      </span>
                    </Tippy>
                  ) : (
                    <span className='font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded'>
                      {nativeVlanId ? getVlanTag(nativeVlanId) || '1' : '1'}
                    </span>
                  )}
                </td>
                <td className='px-3 py-2 text-gray-700 dark:text-gray-300'>
                  {renderTaggedVlans(config)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
