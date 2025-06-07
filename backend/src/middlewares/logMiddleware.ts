import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Logger } from '../utils/logger';
import morgan, { StreamOptions } from 'morgan';
import { Service } from 'typedi';

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: (message) => Logger.http(message),
};

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = (): boolean => {
  return (process.env.NODE_ENV || 'development') !== 'development';
};

@Middleware({ type: 'before' })
@Service()
export class LogMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response, next: NextFunction) {
    return morgan('combined', { stream, skip })(req, res, next);
  }
}
