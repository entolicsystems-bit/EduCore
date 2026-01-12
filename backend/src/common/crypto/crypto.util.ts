import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from "node:crypto";
import { promisify } from "node:util";
import { cryptoConfig } from "src/config/crypto.config";

export class CryptoUtil {
  private static async getKey(): Promise<Buffer> {
    if (!cryptoConfig.secret) {
      throw new Error("CRYPTO_SECRET is missing in environment variables");
    }

    return (await promisify(scrypt)(
      cryptoConfig.secret,
      "crypto_salt",
      32
    )) as Buffer;
  }

  static async encrypt(text: string): Promise<string> {
    if (!text) return text;

    const iv = randomBytes(cryptoConfig.ivLength);
    const key = await this.getKey();

    const cipher = createCipheriv(cryptoConfig.algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);

    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  static async decrypt(encryptedText: string): Promise<string> {
    if (!encryptedText) return encryptedText;

    // ✅ Handle old plain-text data safely
    if (!encryptedText.includes(":")) {
      return encryptedText;
    }

    try {
      const [ivHex, contentHex] = encryptedText.split(":");

      if (!ivHex || !contentHex) {
        return encryptedText;
      }

      const iv = Buffer.from(ivHex, "hex");
      const content = Buffer.from(contentHex, "hex");
      const key = await this.getKey();

      const decipher = createDecipheriv(
        cryptoConfig.algorithm,
        key,
        iv
      );

      const decrypted = Buffer.concat([
        decipher.update(content),
        decipher.final(),
      ]);

      return decrypted.toString("utf8");
    } catch {
      // ✅ Never crash API
      return encryptedText;
    }
  }
}
