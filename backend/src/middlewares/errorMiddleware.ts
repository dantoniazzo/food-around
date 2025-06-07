import { Request, Response, NextFunction } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  HttpError
} from 'routing-controllers';

import { Service } from 'typedi';
import util from 'util';

@Service()
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public error(error: any, req: Request, res: Response): void {
    console.error(util.inspect(error));

    const errorName = error.name;

    // Mongoose bad ObjectId
    if (error.name === 'CastError')
      error = new HttpError(404, `Resource not found`);

    // Mongoose duplicate key
    if (error.code === 11000)
      error = new HttpError(
        400,
        `Duplicate field value entered: ${Object.keys(error.keyPattern)}`
      );

    // Mongoose validation error
    if (error.name === 'ValidationError')
      error = new HttpError(400, error.message);

    if (error.name === 'MongoServerError')
      error = new HttpError(500, 'Internal server error');

    if (error.name == 'BadRequestError') {
      const validationMessage: Array<string> = [' '];

      // Handle top object
      if (error.errors.length == 1) {
        // Handle data object
        const validationError = error.errors[0];
        if (validationError.children.length == 1) {
          // Handle nested object
          const nestedValidationError = validationError.children[0];
          for (let i = 0; i < nestedValidationError.children.length; i++) {
            validationMessage.push(
              `\n${nestedValidationError.children[i].property}: ${Object.values(
                nestedValidationError.children[i].constraints
              ).toString()}`
            );
          }
        }
      }
      if (validationMessage.length > 1) {
        validationMessage.shift();
        error = new HttpError(400, validationMessage.join(' '));
      }
    }

    res.status(error.httpCode || 500).json({
      code: <string>error.httpCode || '500',
      title: errorName || undefined,
      detail: error.message || undefined
    });
  }
}
