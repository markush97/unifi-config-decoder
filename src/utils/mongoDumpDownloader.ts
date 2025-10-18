import { BSON } from 'bson';
import { loadAsync } from 'jszip';
import { ungzip } from 'pako';

import { decryptBuffer, IV_HEX, KEY_HEX } from './cryptoUtils';
import { createEndOfCentralDirectory, parseCentralDirectory } from './zipParser';
import {
  CENTRAL_DIRECTORY_HEADER,
  END_OF_CENTRAL_DIRECTORY,
  concatenateBuffers,
  findFirstIndex,
  findLastIndex,
} from './zipUtils';
import { formatSuggestedFilename } from '../unifi/types';

/**
 * Exports MongoDB dump as JSON file
 */
export async function downloadMongoDump(
  file: File,
  onStatusChange: (status: string) => void
): Promise<void> {
  onStatusChange('Extracting MongoDB dump...');

  // Step 1: Decrypt
  const ciphertext = new Uint8Array(await file.arrayBuffer());
  const decrypted = await decryptBuffer(ciphertext, KEY_HEX, IV_HEX);

  // Step 2: Parse ZIP structure
  const cds = parseCentralDirectory(decrypted);
  const cdStartIndex = findFirstIndex(decrypted, CENTRAL_DIRECTORY_HEADER);
  const newEOCD = createEndOfCentralDirectory(cds, cdStartIndex);
  const eocdIndex = findLastIndex(decrypted, END_OF_CENTRAL_DIRECTORY);
  const beforeEOCD = decrypted.slice(0, eocdIndex);
  const validZip = concatenateBuffers(beforeEOCD, newEOCD);

  // Step 3: Load with JSZip
  const zip = await loadAsync(validZip);
  const dbGzFile = zip.file('db.gz');

  if (!dbGzFile) throw new Error('db.gz not found in backup');

  onStatusChange('Decompressing database...');

  // Step 4: Decompress db.gz
  const dbGz = await dbGzFile.async('uint8array');
  const dbBuffer = ungzip(dbGz);

  onStatusChange('Parsing all collections...');

  // Step 5: Parse all BSON documents
  const collections: Record<string, Record<string, unknown>[]> = {};
  const view = new DataView(dbBuffer.buffer, dbBuffer.byteOffset, dbBuffer.byteLength);
  let offset = 0;
  const length = dbBuffer.length;
  let currentCollection = 'unknown';
  let superIdentity = 'unknown';
  let timestamp: number | undefined;

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

      // Extract super identity for filename
      if (currentCollection === 'setting' && doc.key === 'super_identity') {
        superIdentity = (doc.name as string) || (doc.site_id as string) || 'unknown';
      }

      if (currentCollection === 'stat_archive' && !timestamp) {
        timestamp = doc.datetime as number;
      }
    }

    offset += docSize;
  }

  onStatusChange('Formatting JSON output...');

  // Convert to JSON and download
  const json = JSON.stringify(collections, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const suggestedFilename = formatSuggestedFilename(superIdentity, timestamp);
  a.download =
    suggestedFilename && suggestedFilename.length > 0
      ? suggestedFilename
      : file.name.replace(/\.unf$/, '_mongodb_dump.json');

  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);

  onStatusChange('✅ MongoDB dump downloaded successfully!');
}
