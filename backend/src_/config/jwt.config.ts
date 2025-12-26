import { StringValue } from 'ms';

export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',

  accessTokenExpiresIn: '15m' as StringValue,
  refreshTokenExpiresIn: '7d' as StringValue,
};
