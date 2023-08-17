import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Logging HTTP request ${req.method} ${req.originalUrl}`);

    const originalSend = res.send;
    res.send = (body: any): Response => {
      const statusCode = res.statusCode;

      if (statusCode === HttpStatus.OK)
        this.logger.log(`Logging HTTP Response ${statusCode}`);
      else if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR)
        this.logger.error(`Logging HTTP Response ${statusCode}`);
      else this.logger.debug(`Logging HTTP Response ${statusCode}`);

      return originalSend.call(res, body);
    };

    next();
  }
}
