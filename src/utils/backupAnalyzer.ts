import JSZip from 'jszip';
import { ungzip } from 'pako';

import type { BackupInfo, DeviceRecord, VlanConfig, WanConfig } from '../unifi/types';
import { categorizeDevices, formatSuggestedFilename } from '../unifi/types';

import { IV_HEX, KEY_HEX, decryptBuffer } from './cryptoUtils';
import { createEndOfCentralDirectory, parseCentralDirectory } from './zipParser';
import {
  CENTRAL_DIRECTORY_HEADER,
  END_OF_CENTRAL_DIRECTORY,
  concatenateBuffers,
  findFirstIndex,
  findLastIndex,
} from './zipUtils';

/**
 * Analyzes a UniFi backup file and extracts all metadata
 */
export async function analyzeBackup(
  file: File,
  onStatusChange: (status: string) => void
): Promise<BackupInfo> {
  onStatusChange('🔐 Decrypting backup...');

  // Step 1: Decrypt
  const ciphertext = new Uint8Array(await file.arrayBuffer());
  const decrypted = await decryptBuffer(ciphertext, KEY_HEX, IV_HEX);

  onStatusChange('📦 Parsing ZIP structure...');

  // Step 2: Parse ZIP structure
  const cds = parseCentralDirectory(decrypted);
  const cdStartIndex = findFirstIndex(decrypted, CENTRAL_DIRECTORY_HEADER);
  const newEOCD = createEndOfCentralDirectory(cds, cdStartIndex);
  const eocdIndex = findLastIndex(decrypted, END_OF_CENTRAL_DIRECTORY);
  const beforeEOCD = decrypted.slice(0, eocdIndex);
  const validZip = concatenateBuffers(beforeEOCD, newEOCD);

  onStatusChange('📂 Loading backup contents...');

  // Step 3: Load with JSZip
  const zip = await JSZip.loadAsync(validZip);
  const dbGzFile = zip.file('db.gz');

  if (!dbGzFile) throw new Error('db.gz not found in backup');

  onStatusChange('🗜️ Decompressing database...');

  // Step 4: Decompress db.gz
  const dbGz = await dbGzFile.async('uint8array');
  const dbBuffer = ungzip(dbGz);

  onStatusChange('🔍 Parsing BSON documents...');

  // Step 5: Parse all BSON documents
  const collections = await parseBSONCollections(dbBuffer);

  onStatusChange('📊 Extracting device and network information...');

  // Extract metadata
  const { superIdentity, timestamp } = extractMetadata(collections);
  const devices = extractDevices(collections);
  const { switches, otherDevices } = categorizeDevices(devices);
  const wanConfigs = extractWANConfigs(collections);
  const vlanConfigs = extractVLANConfigs(collections);
  const portConfigs = extractPortConfigs(collections);
  const allNetworkConfs = extractAllNetworkConfs(collections);
  const version = extractVersion(collections);
  const suggestedFilename = formatSuggestedFilename(superIdentity, timestamp);

  return {
    filename: file.name,
    version,
    timestamp,
    type: file.name.includes('autobackup') ? 'backup' : 'site export',
    deviceCount: devices.length,
    devices,
    switches,
    otherDevices,
    superIdentity,
    suggestedFilename,
    wanConfigs,
    vlanConfigs,
    portConfigs,
    allNetworkConfs,
  };
}

/**
 * Parses all BSON collections from the database buffer
 */
async function parseBSONCollections(
  dbBuffer: Uint8Array
): Promise<Record<string, Record<string, unknown>[]>> {
  const { BSON } = await import('bson');
  const collections: Record<string, Record<string, unknown>[]> = {};
  const view = new DataView(dbBuffer.buffer, dbBuffer.byteOffset, dbBuffer.byteLength);
  let offset = 0;
  const length = dbBuffer.length;
  let currentCollection = 'unknown';

  while (offset < length) {
    const docSize = view.getInt32(offset, true);

    if (offset + docSize > length || dbBuffer[offset + docSize - 1] !== 0) {
      break;
    }

    const doc = BSON.deserialize(dbBuffer, {
      index: offset,
      allowObjectSmallerThanBufferSize: true,
      promoteBuffers: true,
    }) as Record<string, unknown>;

    // Check for collection switch command
    if (doc?.__cmd === 'select') {
      currentCollection = (doc.collection as string) || 'unknown';
      if (!collections[currentCollection]) {
        collections[currentCollection] = [];
      }
    } else {
      // Add document to current collection
      if (!collections[currentCollection]) {
        collections[currentCollection] = [];
      }
      collections[currentCollection].push(doc);
    }

    offset += docSize;
  }

  return collections;
}

/**
 * Extracts site metadata (super_identity and timestamp)
 */
function extractMetadata(collections: Record<string, Record<string, unknown>[]>): {
  superIdentity: string;
  timestamp?: number;
} {
  let superIdentity = 'unknown';
  let timestamp: number | undefined;

  // Extract super_identity from setting collection
  const superIdentityDoc = collections['setting']?.find(
    (s: Record<string, unknown>) => s.key === 'super_identity'
  );
  if (superIdentityDoc) {
    superIdentity =
      (superIdentityDoc.name as string) || (superIdentityDoc.site_id as string) || 'unknown';
  }

  // Extract timestamp from backup collection
  const backupDoc = collections['backup']?.[0];
  if (backupDoc?.datetime) {
    timestamp = backupDoc.datetime as number;
  }

  return { superIdentity, timestamp };
}

/**
 * Extracts device records
 */
function extractDevices(collections: Record<string, Record<string, unknown>[]>): DeviceRecord[] {
  return collections['device'] || [];
}

/**
 * Extracts WAN configurations from networkconf collection
 */
function extractWANConfigs(collections: Record<string, Record<string, unknown>[]>): WanConfig[] {
  const wanConfigs: WanConfig[] = [];
  const networkConfDocs = collections['networkconf'] || [];
  const wanNetworks = networkConfDocs.filter(
    (net: Record<string, unknown>) => net.purpose === 'wan'
  );

  wanNetworks.forEach((wan: Record<string, unknown>) => {
    wanConfigs.push({
      name: (wan.name as string) || 'WAN',
      wan_ip: wan.wan_ip as string | undefined,
      wan_gateway: wan.wan_gateway as string | undefined,
      wan_netmask: wan.wan_netmask as string | undefined,
      wan_dns1: wan.wan_dns1 as string | undefined,
      wan_dns2: wan.wan_dns2 as string | undefined,
      wan_type: wan.wan_type as string | undefined,
      wan_networkgroup: wan.wan_networkgroup as string | undefined,
    });
  });

  return wanConfigs;
}

/**
 * Extracts VLAN configurations from networkconf collection
 */
function extractVLANConfigs(collections: Record<string, Record<string, unknown>[]>): VlanConfig[] {
  const vlanConfigs: VlanConfig[] = [];
  const networkCollection = collections['networkconf'] || [];

  networkCollection.forEach((net: Record<string, unknown>) => {
    if (net.vlan !== undefined) {
      vlanConfigs.push({
        name: (net.name as string) || 'Unnamed',
        vlan: net.vlan as number | undefined,
        ip_subnet: net.ip_subnet as string | undefined,
        dhcpd_start: net.dhcpd_start as string | undefined,
        dhcpd_stop: net.dhcpd_stop as string | undefined,
        gateway_type: net.gateway_type as string | undefined,
        purpose: net.purpose as string | undefined,
        enabled: net.enabled as boolean | undefined,
      });
    }
  });

  return vlanConfigs;
}

/**
 * Extracts UniFi controller version
 */
function extractVersion(
  collections: Record<string, Record<string, unknown>[]>
): string | undefined {
  return collections['setting']?.find((s: Record<string, unknown>) => s.key === 'version')
    ?.version as string | undefined;
}

/**
 * Extracts port configurations (portconf collection)
 */
function extractPortConfigs(
  collections: Record<string, Record<string, unknown>[]>
): Record<string, unknown>[] {
  return collections['portconf'] || [];
}

/**
 * Extracts all networkconf entries for VLAN/network lookups
 */
function extractAllNetworkConfs(
  collections: Record<string, Record<string, unknown>[]>
): Record<string, unknown>[] {
  return collections['networkconf'] || [];
}
