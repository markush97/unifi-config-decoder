import React from 'react';

import type { VpnConfig } from '../types';

interface VpnsTabProps {
  vpnConfigs: VpnConfig[];
}

export const VpnsTab: React.FC<VpnsTabProps> = ({ vpnConfigs }) => {
  if (vpnConfigs.length === 0) {
    return (
      <div className='text-center text-gray-500 py-8'>No Site-to-Site VPN configurations found</div>
    );
  }

  return (
    <div>
      <h3 className='font-bold text-xl mb-4'>Site-to-Site VPN Configurations</h3>
      <div className='space-y-6'>
        {vpnConfigs.map((vpn, idx) => (
          <div
            key={vpn.name || `vpn-${idx}`}
            className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
          >
            <div className='flex items-center justify-between mb-4'>
              <h4 className='font-semibold text-lg text-gray-800 dark:text-gray-200'>{vpn.name}</h4>
              <div className='flex items-center gap-2'>
                {vpn.enabled ? (
                  <span className='inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-3 py-1 rounded-full font-medium text-sm'>
                    Enabled
                  </span>
                ) : (
                  <span className='inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full font-medium text-sm'>
                    Disabled
                  </span>
                )}
                <span className='inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium text-sm uppercase'>
                  {vpn.vpn_type || 'IPSec'}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Connection Details */}
              <div className='space-y-3'>
                <h5 className='font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1'>
                  Connection Details
                </h5>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>Peer IP:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_peer_ip || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>Local IP:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_local_ip || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>Interface:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_interface || 'N/A'}
                    </span>
                  </div>
                  {vpn.ipsec_tunnel_ip && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-400'>Tunnel IP:</span>
                      <span className='font-mono text-gray-800 dark:text-gray-200'>
                        {vpn.ipsec_tunnel_ip}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Encryption Settings */}
              <div className='space-y-3'>
                <h5 className='font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1'>
                  Encryption Settings
                </h5>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>Key Exchange:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200 uppercase'>
                      {vpn.ipsec_key_exchange || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>IKE Encryption:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200 uppercase'>
                      {vpn.ipsec_ike_encryption || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>ESP Encryption:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200 uppercase'>
                      {vpn.ipsec_esp_encryption || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>IKE Hash:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200 uppercase'>
                      {vpn.ipsec_ike_hash || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>ESP Hash:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200 uppercase'>
                      {vpn.ipsec_esp_hash || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className='space-y-3'>
                <h5 className='font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1'>
                  Advanced Settings
                </h5>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>IKE DH Group:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_ike_dh_group || vpn.ipsec_dh_group || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>ESP DH Group:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_esp_dh_group || 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>IKE Lifetime:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_ike_lifetime ? `${vpn.ipsec_ike_lifetime}s` : 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>ESP Lifetime:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_esp_lifetime ? `${vpn.ipsec_esp_lifetime}s` : 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>PFS:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_pfs ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-400'>Dynamic Routing:</span>
                    <span className='font-mono text-gray-800 dark:text-gray-200'>
                      {vpn.ipsec_dynamic_routing ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {vpn.route_distance && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-400'>Route Distance:</span>
                      <span className='font-mono text-gray-800 dark:text-gray-200'>
                        {vpn.route_distance}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remote Networks */}
              {vpn.remote_vpn_subnets && vpn.remote_vpn_subnets.length > 0 && (
                <div className='space-y-3'>
                  <h5 className='font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1'>
                    Remote Networks
                  </h5>
                  <div className='space-y-1'>
                    {vpn.remote_vpn_subnets.map((subnet, subnetIdx) => (
                      <div
                        key={`${vpn.name}-subnet-${subnet}-${subnetIdx}`}
                        className='bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded font-mono text-sm text-gray-800 dark:text-gray-200'
                      >
                        {subnet}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pre-shared Key */}
              <div className='space-y-3'>
                <h5 className='font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1'>
                  Authentication
                </h5>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='text-gray-600 dark:text-gray-400 block mb-1'>
                      Pre-shared Key:
                    </span>
                    <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded p-2'>
                      <span className='font-mono text-yellow-800 dark:text-yellow-200 text-xs break-all'>
                        {vpn.x_ipsec_pre_shared_key || 'Not configured'}
                      </span>
                    </div>
                  </div>
                  {vpn.ipsec_local_identifier && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-400'>Local ID:</span>
                      <span className='font-mono text-gray-800 dark:text-gray-200'>
                        {vpn.ipsec_local_identifier}
                      </span>
                    </div>
                  )}
                  {vpn.ipsec_remote_identifier && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-400'>Remote ID:</span>
                      <span className='font-mono text-gray-800 dark:text-gray-200'>
                        {vpn.ipsec_remote_identifier}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Interface Settings */}
              {(vpn.interface_mtu || vpn.interface_mtu_enabled !== undefined) && (
                <div className='space-y-3'>
                  <h5 className='font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1'>
                    Interface Settings
                  </h5>
                  <div className='space-y-2 text-sm'>
                    {vpn.interface_mtu && (
                      <div className='flex justify-between'>
                        <span className='text-gray-600 dark:text-gray-400'>MTU:</span>
                        <span className='font-mono text-gray-800 dark:text-gray-200'>
                          {vpn.interface_mtu}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-400'>MTU Override:</span>
                      <span className='font-mono text-gray-800 dark:text-gray-200'>
                        {vpn.interface_mtu_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
