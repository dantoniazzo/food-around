import { Request, Response, NextFunction } from 'express';
import {
  ExpressMiddlewareInterface,
  UnauthorizedError
} from 'routing-controllers';
import { Service, Inject } from 'typedi';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { Document, Model } from 'mongoose';
import { UserDocument } from '../models/userModel';
import { decodeJwt } from '../utils/jwt';

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  constructor(
    @Inject('userModel') private userModel: Model<UserDocument & Document>
  ) {}
  public async use(
    req: Request & { id: string },
    res: Response,
    next: NextFunction
  ) {
    let token;

    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new UnauthorizedError('Not authorized'));
    }

    try {
      const decoded = decodeJwt(token);
      const foundUser = await this.userModel.findById(decoded.id);
      if (!foundUser) {
        console.debug('User not found');
        throw new Error('User not found');
      }

      req.id = foundUser._id as string;
    } catch (err) {
      return next(new UnauthorizedError('Not authorized'));
    }

    next();
  }
}
