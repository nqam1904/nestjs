import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
let start;
let result;
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    start = Date.now();
    const { ip = '', method, originalUrl, body } = request;
    const userAgent = request.get('user-agent') || '';
    // this.logger.log(
    //   `[REQUEST - ${userAgent} - ${ip}] ${method} ${originalUrl} ${JSON.stringify(body)}`,
    // );
    this.logger.debug(
      `[REQUEST - ${userAgent}] ${method} ${originalUrl} ${JSON.stringify(body)}`,
    );

    const oldWrite = response.write;
    const oldEnd = response.end;
    const chunks = [];
    // REQUEST
    response.write = function (chunk: any) {
      chunks.push(chunk);
      // eslint-disable-next-line prefer-rest-params
      return oldWrite.apply(response, arguments);
    };

    // RESPONSE
    response.end = function (chunk: any) {
      if (chunk) {
        chunks.push(chunk);
      }
      // eslint-disable-next-line prefer-rest-params
      return oldEnd.apply(response, arguments);
    };

    response.on('finish', () => {
      const { statusCode } = response;

      const responseBody = Buffer.concat(chunks).toString('utf8');
      result = Date.now() - start;
      this.logger.verbose(
        `[RESPONSE] ${method} ${originalUrl} ${statusCode} ${responseBody} - ${result}ms`,
      );
    });

    next();
  }
}
