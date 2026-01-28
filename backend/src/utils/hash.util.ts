import * as crypto from "crypto";

function getHashSecret(): string {
  const secret = process.env.HASH_SECRET;
  if (!secret) {
    throw new Error("HASH_SECRET is not defined in environment variables!");
  }
  return secret;
}

export function hashValue(value: string): string {
  const normalized = value.trim().toLowerCase(); // normalize for emails
  return crypto
    .createHmac("sha256", getHashSecret())
    .update(normalized)
    .digest("hex");
}

export function hashEmail(email: string): string {
  return hashValue(email);
}

export function hashPhone(phone: string): string {
  const normalized = phone.replace(/\D/g, "");
  return crypto
    .createHmac("sha256", getHashSecret())
    .update(normalized)
    .digest("hex");
}
