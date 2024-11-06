import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('request');
    next();
  }
}

// si nuestro middleware no necesita dependencias es conveniente usar un functional middleware
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`request`);
  next();
}
