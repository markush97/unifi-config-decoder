import CryptoJS from 'crypto-js';

export const decryptBuffer = async (
  buffer: Uint8Array,
  keyHex: string,
  ivHex: string
): Promise<Uint8Array> => {
  const key = CryptoJS.enc.Hex.parse(keyHex);
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const ciphertext = CryptoJS.lib.WordArray.create(buffer as unknown as number[]);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext } as CryptoJS.lib.CipherParams, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.NoPadding,
  }).words;
  const out = new Uint8Array(4 * decrypted.length);
  for (let i = 0; i < decrypted.length; i++) {
    out[4 * i] = (decrypted[i] >>> 24) & 255;
    out[4 * i + 1] = (decrypted[i] >>> 16) & 255;
    out[4 * i + 2] = (decrypted[i] >>> 8) & 255;
    out[4 * i + 3] = 255 & decrypted[i];
  }
  return out;
};

export const KEY_HEX = '626379616e676b6d6c756f686d617273';
export const IV_HEX = '75626e74656e74657270726973656170';
