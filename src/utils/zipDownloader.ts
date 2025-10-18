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
 * Decrypts a .unf file and downloads it as a ZIP
 */
export async function downloadAsZip(file: File): Promise<void> {
  const ciphertext = new Uint8Array(await file.arrayBuffer());
  const decrypted = await decryptBuffer(ciphertext, KEY_HEX, IV_HEX);

  const cds = parseCentralDirectory(decrypted);
  const cdStartIndex = findFirstIndex(decrypted, CENTRAL_DIRECTORY_HEADER);
  const newEOCD = createEndOfCentralDirectory(cds, cdStartIndex);
  const eocdIndex = findLastIndex(decrypted, END_OF_CENTRAL_DIRECTORY);
  const beforeEOCD = decrypted.slice(0, eocdIndex);
  const validZip = concatenateBuffers(beforeEOCD, newEOCD);

  const blob = new Blob([validZip.slice()], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${file.name.replace(/\.unf$/, '')}.zip`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
