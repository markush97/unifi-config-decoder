// ZIP file signatures
export const LOCAL_FILE_HEADER = new Uint8Array([80, 75, 3, 4]);
export const CENTRAL_DIRECTORY_HEADER = new Uint8Array([80, 75, 1, 2]);
export const END_OF_CENTRAL_DIRECTORY = new Uint8Array([80, 75, 5, 6]);

const matchesPatternAt = (buffer: Uint8Array, pattern: Uint8Array, position: number): boolean => {
  for (let j = 0; j < pattern.length; j++) {
    if (buffer[position + j] !== pattern[j]) {
      return false;
    }
  }
  return true;
};

export const findLastIndex = (buffer: Uint8Array, pattern: Uint8Array): number => {
  for (let i = buffer.length - pattern.length; i >= 0; i--) {
    if (matchesPatternAt(buffer, pattern, i)) {
      return i;
    }
  }
  return -1;
};

export const findFirstIndex = (buffer: Uint8Array, pattern: Uint8Array): number => {
  for (let i = 0; i <= buffer.length - pattern.length; i++) {
    if (matchesPatternAt(buffer, pattern, i)) {
      return i;
    }
  }
  return -1;
};

export const findAllIndices = (buffer: Uint8Array, pattern: Uint8Array): number[] => {
  const indices: number[] = [];
  for (let i = 0; i <= buffer.length - pattern.length; i++) {
    if (matchesPatternAt(buffer, pattern, i)) {
      indices.push(i);
    }
  }
  return indices;
};

export const concatenateBuffers = (buffer1: Uint8Array, buffer2: Uint8Array): Uint8Array => {
  const result = new Uint8Array(buffer1.length + buffer2.length);
  result.set(buffer1);
  result.set(buffer2, buffer1.length);
  return result;
};

export const readUint16LE = (buffer: Uint8Array, offset: number): number =>
  (buffer[offset + 1] << 8) | buffer[offset];

export const readUint32LE = (buffer: Uint8Array, offset: number): number =>
  (buffer[offset + 3] << 24) |
  (buffer[offset + 2] << 16) |
  (buffer[offset + 1] << 8) |
  buffer[offset];

export const writeUint16LE = (buffer: Uint8Array, offset: number, value: number): void => {
  buffer[offset] = value;
  buffer[offset + 1] = value >> 8;
};

export const writeUint32LE = (buffer: Uint8Array, offset: number, value: number): void => {
  buffer[offset] = value;
  buffer[offset + 1] = value >> 8;
  buffer[offset + 2] = value >> 16;
  buffer[offset + 3] = value >> 24;
};
