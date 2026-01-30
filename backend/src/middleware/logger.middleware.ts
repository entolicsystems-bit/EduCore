import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction, response } from "express";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: any // Nest Logger wrapper
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();


    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress;

    
    res.on("finish", () => {
      this.logger.log("HTTP Request", {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${Date.now() - start}ms`,
        //response,
        ip: clientIp,
      });
    });

    next();
  }
}
