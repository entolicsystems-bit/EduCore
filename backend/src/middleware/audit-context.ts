import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';


@Injectable()
export class AuditContextMiddleware implements NestMiddleware {
  use(req: Request & any, res: Response, next: NextFunction) {
    req.audit = {
      userId: req.user?.id,
    };
    next();
  }
}
