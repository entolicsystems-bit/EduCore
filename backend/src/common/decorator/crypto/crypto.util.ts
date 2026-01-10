import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'node:crypto';
import { promisify } from 'node:util';

const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;

/**
 * NOTE:
 * CRYPTO_SECRET must be a strong value stored in .env
 * Example:
 * CRYPTO_SECRET=9f4c2a6b7e2d5b6e0b0d8c3b1c7c9d7a9e2f6c1d4a8b3e9f2c1a0b6d5e4f3a2
 */
const PASSWORD = process.env.CRYPTO_SECRET;

if (!PASSWORD) {
  throw new Error('CRYPTO_SECRET is missing in environment variables');
}

export class CryptoUtil {
  private static async getKey(): Promise<Buffer> {
    // Derive a 32-byte key using scrypt
    return (await promisify(scrypt)(
      PASSWORD,
      'crypto_salt', // keep constant
      32,
    )) as Buffer;
  }

  /**
   * Encrypt plain text
   * @param text string
   * @returns encrypted string in format: iv:content
   */
  static async encrypt(text: string): Promise<string> {
    if (!text) return text;

    const iv = randomBytes(IV_LENGTH);
    const key = await this.getKey();

    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  /**
   * Decrypt encrypted text
   * @param encryptedText string (iv:content)
   * @returns decrypted plain text
   */
  static async decrypt(encryptedText: string): Promise<string> {
    if (!encryptedText) return encryptedText;

    const [ivHex, contentHex] = encryptedText.split(':');

    if (!ivHex || !contentHex) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const content = Buffer.from(contentHex, 'hex');
    const key = await this.getKey();

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    const decrypted = Buffer.concat([
      decipher.update(content),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}
