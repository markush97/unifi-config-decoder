import React from 'react';

interface TabNavigationProps {
  activeTab: 'overview' | 'switches' | 'devices' | 'wan' | 'vlans' | 'vpns';
  onTabChange: (tab: 'overview' | 'switches' | 'devices' | 'wan' | 'vlans' | 'vpns') => void;
  switchCount: number;
  deviceCount: number;
  wanCount: number;
  vlanCount: number;
  vpnCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  switchCount,
  deviceCount,
  wanCount,
  vlanCount,
  vpnCount,
}) => {
  const tabs = [
    { id: 'overview' as const, label: '📋 Overview', count: null },
    { id: 'switches' as const, label: '🔌 Switches', count: switchCount },
    { id: 'devices' as const, label: '🖥️ Other Devices', count: deviceCount },
    { id: 'wan' as const, label: '🌐 WAN', count: wanCount },
    { id: 'vlans' as const, label: '🔀 VLANs', count: vlanCount },
    { id: 'vpns' as const, label: '🔐 Site2Site VPNs', count: vpnCount },
  ];

  return (
    <div className='border-b border-gray-200 dark:border-gray-700 mb-6'>
      <nav className='flex gap-1'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
            {tab.count !== null && ` (${tab.count})`}
          </button>
        ))}
      </nav>
    </div>
  );
};
