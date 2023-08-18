import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { inspect } from 'util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `Logging HTTP request ${req.method} ${req.originalUrl} | ${res.statusCode}`,
    );

    if (req.files && req.files['image']) {
      const uploadedFile = req.files['image'];
      this.logger.log(
        `Uploaded File Details: ${JSON.stringify(uploadedFile, null, 2)}`,
      );
    }

    if (req.body) {
      const requestBody = JSON.stringify(req.body, null, 0);
      this.logger.log(`Body: ${requestBody}`);
    }

    next();
  }
}
