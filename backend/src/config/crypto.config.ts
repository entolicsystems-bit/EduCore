export const cryptoConfig = {
  secret: process.env.CRYPTO_SECRET as string,
  algorithm: 'aes-256-ctr',
  ivLength: 16,
};
