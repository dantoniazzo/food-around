import { Request, Response, NextFunction } from 'express';
import {
  ExpressMiddlewareInterface,
  UnauthorizedError,
} from 'routing-controllers';
import { Service, Inject } from 'typedi';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { Document, Model } from 'mongoose';
import { UserDocument } from '../models/userModel';
import { Logger } from '../utils/logger';

interface JwtPayloadId extends JwtPayload {
  id?: any;
}

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  constructor(
    @Inject('userModel') private userModel: Model<UserDocument & Document>
  ) {}
  public async use(req: Request, res: Response, next: NextFunction) {
    let token;

    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new UnauthorizedError('Not authorized'));
    }

    try {
      const decoded = jwt.verify(
        token,
        env.jwt.secret as string
      ) as JwtPayloadId;
      //req.user = decoded.id;
      const foundUser = await this.userModel.findById(decoded.id);
      if (!foundUser) {
        Logger.debug('User not found');
        throw new Error('User not found');
      }

      req.user = foundUser._id;
    } catch (err) {
      return next(new UnauthorizedError('Not authorized'));
    }

    next();
  }
}
