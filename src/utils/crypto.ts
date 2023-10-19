import * as crypto from 'crypto';
import * as fs from 'fs';
const algorithm = 'aes-256-cbc';

function generateEncryptionKey(): Buffer {
  return crypto.randomBytes(16);
}

function saveEncryptionKey(key: Buffer): void {
  try {
    const config = JSON.parse(fs.readFileSync('keys.json', 'utf8'));
    config.key16 = key.toString('hex');
    fs.writeFileSync('keys.json', JSON.stringify(config));
    console.log('Encryption key saved.');
  } catch (error) {
    console.error('Error saving encryption key:', error);
  }
}

function loadEncryptionKey(): Buffer {
  try {
    const config = JSON.parse(fs.readFileSync('keys.json', 'utf8'));
    const keyString = config.key16;
    return Buffer.from(keyString, 'hex');
  } catch (error) {
    const newKey = generateEncryptionKey();
    saveEncryptionKey(newKey);
    return newKey;
  }
}

const iv = loadEncryptionKey();

export function encrypt(text: string, key: Buffer): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encryptedText: string, key: Buffer): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
