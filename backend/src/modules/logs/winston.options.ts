import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const winstonOpions: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),
  ],
};
