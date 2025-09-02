import CryptoJS from 'crypto-js';

// Encryption key - in production, this should come from environment variables
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'vais-default-encryption-key-2024';

/**
 * Encrypt data for storage
 */
export const encrypt = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

/**
 * Decrypt data from storage
 */
export const decrypt = (encryptedData: string): any => {
  try {
    if (!encryptedData) return null;
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) return null;
    
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Create encrypted transform for redux-persist
 */
export const createEncryptTransform = () => {
  return {
    in: (inboundState: any, key: string) => {
      return encrypt(inboundState);
    },
    out: (outboundState: string, key: string) => {
      return decrypt(outboundState);
    },
  };
};
