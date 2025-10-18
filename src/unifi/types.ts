export type TabType = 'overview' | 'switches' | 'devices' | 'wan' | 'vlans';

export interface DeviceRecord {
  _id?: string;
  name?: string;
  model?: string;
  mac?: string;
  ip?: string;
  version?: string;
  adopted?: boolean;
  state?: number;
  type?: string;
  port_overrides?: PortOverride[];
  [key: string]: unknown;
}

export interface PortOverride {
  port_idx?: number;
  portconf_id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface PortConfig {
  _id?: string;
  name?: string;
  native_networkconf_id?: string;
  tagged_networkconf_ids?: string[];
  [key: string]: unknown;
}

export interface NetworkConfig {
  _id?: string;
  name?: string;
  vlan?: number;
  purpose?: string;
  ip_subnet?: string;
  [key: string]: unknown;
}

export interface WanConfig {
  name: string;
  wan_ip?: string;
  wan_gateway?: string;
  wan_netmask?: string;
  wan_dns1?: string;
  wan_dns2?: string;
  wan_type?: string;
  wan_networkgroup?: string;
}

export interface VlanConfig {
  name: string;
  vlan?: number;
  ip_subnet?: string;
  dhcpd_start?: string;
  dhcpd_stop?: string;
  gateway_type?: string;
  purpose?: string;
  enabled?: boolean;
}

export interface BackupInfo {
  filename: string;
  version?: string;
  timestamp?: number;
  type: 'backup' | 'site export';
  deviceCount: number;
  devices: DeviceRecord[];
  switches: DeviceRecord[];
  otherDevices: DeviceRecord[];
  superIdentity?: string;
  suggestedFilename?: string;
  wanConfigs: WanConfig[];
  vlanConfigs: VlanConfig[];
  portConfigs: PortConfig[];
  allNetworkConfs: NetworkConfig[];
}

// Helper function to format the suggested filename
export const formatSuggestedFilename = (superIdentity: string, timestamp?: number): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '.');
  const sanitizedIdentity = superIdentity.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `unifi_${sanitizedIdentity}_${dateStr}.json`;
};

// Helper function to convert subnet mask to CIDR notation
export const subnetMaskToCIDR = (mask: string): number => {
  const parts = mask.split('.').map(Number);
  let cidr = 0;
  for (const part of parts) {
    cidr += part.toString(2).split('1').length - 1;
  }
  return cidr;
};

// Helper function to format IP with subnet mask
export const formatIPWithMask = (ip?: string, mask?: string): string => {
  if (!ip) return 'N/A';
  if (!mask) return ip;
  const cidr = subnetMaskToCIDR(mask);
  return `${ip}/${cidr}`;
};

// Helper function to check if WAN has any valid data
export const hasValidWanData = (wan: WanConfig): boolean => {
  return !!(wan.wan_ip || wan.wan_gateway || wan.wan_dns1 || wan.wan_dns2 || wan.wan_type);
};

// Helper function to check if a device is a switch or gateway (has port_overrides)
export const isSwitchOrGateway = (device: DeviceRecord): boolean => {
  return !!device.port_overrides;
};

// Helper function to separate switches/gateways from other devices
export const categorizeDevices = (
  devices: DeviceRecord[]
): { switches: DeviceRecord[]; otherDevices: DeviceRecord[] } => {
  const switches: DeviceRecord[] = [];
  const otherDevices: DeviceRecord[] = [];

  devices.forEach(device => {
    if (isSwitchOrGateway(device)) {
      switches.push(device);
    } else {
      otherDevices.push(device);
    }
  });

  return { switches, otherDevices };
};
