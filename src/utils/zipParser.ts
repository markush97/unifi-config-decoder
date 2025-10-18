import {
  CENTRAL_DIRECTORY_HEADER,
  END_OF_CENTRAL_DIRECTORY,
  findAllIndices,
  findLastIndex,
  readUint16LE,
  readUint32LE,
  writeUint16LE,
  writeUint32LE,
} from './zipUtils';

export interface CentralDirectoryHeader {
  signature: number;
  version: number;
  versionRequired: number;
  flags: number;
  compressionMethod: number;
  lastModifiedTime: number;
  lastModifiedDate: number;
  crc32: number;
  compressedSize: number;
  uncompressedSize: number;
  fileNameLength: number;
  extraFieldLength: number;
  fileCommentLength: number;
  diskNumberStart: number;
  internalFileAttributes: number;
  externalFileAttributes: number;
  relativeOffset: number;
  fileName: string;
  extraField: string;
  fileComment: string;
}

export const parseCentralDirectoryHeader = (buffer: Uint8Array): CentralDirectoryHeader => {
  const signature = (buffer[3] << 24) | (buffer[2] << 16) | (buffer[1] << 8) | buffer[0];
  const version = readUint16LE(buffer, 4);
  const versionRequired = readUint16LE(buffer, 6);
  const flags = readUint16LE(buffer, 8);
  const compressionMethod = readUint16LE(buffer, 10);
  const lastModifiedTime = readUint16LE(buffer, 12);
  const lastModifiedDate = readUint16LE(buffer, 14);
  const crc32 = readUint32LE(buffer, 16);
  const compressedSize = readUint32LE(buffer, 20);
  const uncompressedSize = readUint32LE(buffer, 24);
  const fileNameLength = readUint16LE(buffer, 28);
  const extraFieldLength = readUint16LE(buffer, 30);
  const fileCommentLength = readUint16LE(buffer, 32);
  const diskNumberStart = readUint16LE(buffer, 34);
  const internalFileAttributes = readUint16LE(buffer, 36);
  const externalFileAttributes = readUint32LE(buffer, 38);
  const relativeOffset = readUint32LE(buffer, 42);
  const fileName = new TextDecoder().decode(buffer.slice(46, 46 + fileNameLength));
  const extraField = new TextDecoder().decode(
    buffer.slice(46 + fileNameLength, 46 + fileNameLength + extraFieldLength)
  );
  const fileComment = new TextDecoder().decode(
    buffer.slice(
      46 + fileNameLength + extraFieldLength,
      46 + fileNameLength + extraFieldLength + fileCommentLength
    )
  );

  return {
    signature,
    version,
    versionRequired,
    flags,
    compressionMethod,
    lastModifiedTime,
    lastModifiedDate,
    crc32,
    compressedSize,
    uncompressedSize,
    fileNameLength,
    extraFieldLength,
    fileCommentLength,
    diskNumberStart,
    internalFileAttributes,
    externalFileAttributes,
    relativeOffset,
    fileName,
    extraField,
    fileComment,
  };
};

export const parseCentralDirectory = (buffer: Uint8Array): CentralDirectoryHeader[] => {
  const cdIndices = findAllIndices(buffer, CENTRAL_DIRECTORY_HEADER);
  const eocdIndex = findLastIndex(buffer, END_OF_CENTRAL_DIRECTORY);
  const headers: CentralDirectoryHeader[] = [];

  for (let i = 0; i < cdIndices.length; i++) {
    const nextIndex = cdIndices[i + 1] || eocdIndex;
    const header = parseCentralDirectoryHeader(buffer.slice(cdIndices[i], nextIndex));
    headers.push(header);
  }

  return headers;
};

const calculateCDSize = (cds: CentralDirectoryHeader[]): number => {
  let size = 0;
  for (const cd of cds) {
    size += 46 + cd.fileNameLength + cd.extraFieldLength + cd.fileCommentLength;
  }
  return size;
};

export const createEndOfCentralDirectory = (
  cds: CentralDirectoryHeader[],
  cdOffset: number
): Uint8Array => {
  const buffer = new Uint8Array(22);
  writeUint32LE(buffer, 0, 0x06054b50); // EOCD signature
  writeUint16LE(buffer, 4, 0); // disk number
  writeUint16LE(buffer, 6, 0); // disk number start
  writeUint16LE(buffer, 8, cds.length); // number of records on disk
  writeUint16LE(buffer, 10, cds.length); // number of records
  writeUint32LE(buffer, 12, calculateCDSize(cds)); // size of central directory
  writeUint32LE(buffer, 16, cdOffset); // offset of central directory
  writeUint16LE(buffer, 20, 0); // comment length
  return buffer;
};
