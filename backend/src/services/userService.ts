import { User } from '../interfaces/user';
import { Inject, Service } from 'typedi';
import { Document, Model } from 'mongoose';
import { UserDocument } from '../models/userModel';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { decodeJwt } from '../utils/jwt';
@Service()
export class UserService {
  constructor(
    @Inject('userModel') private userModel: Model<UserDocument & Document>
  ) {}

  public async getMe(token: string) {
    const decoded = decodeJwt(token);
    const foundUser = await this.userModel.findById(decoded.id).lean();
    if (!foundUser) {
      console.debug('User not found');
      throw new Error('User not found');
    }
    return foundUser;
  }

  public async create(user: User) {
    const data = await this.userModel.create(user);
    return data;
  }

  public async read(id: string) {
    const data = await this.userModel.findById(id).lean();
    return data;
  }

  public async update(id: string, user: User) {
    const data = await this.userModel
      .findByIdAndUpdate(id, user, {
        new: true,
        runValidators: true
      })
      .lean();
    return data;
  }

  public async delete(id: string) {
    const data = await this.userModel.findByIdAndDelete(id).lean();
    return data;
  }
}
