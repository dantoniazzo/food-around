import { Document, Model } from 'mongoose';
import { HttpError, NotFoundError } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { User, UserLogin } from '../interfaces/user';
import { UserDocument } from '../models/userModel';

@Service()
export class AuthService {
  constructor(
    @Inject('userModel') private userModel: Model<UserDocument & Document>
  ) {}

  public async register(user: User) {
    const data = await this.userModel.create(user);
    await data.save({ validateBeforeSave: false });
    return {
      id: data._id,
      token: data.getSignedJwtToken()
    };
  }

  public async login(user: UserLogin) {
    let data;

    if (!user.email) {
      data = await this.userModel
        .findOne({
          name: user.name
        })
        .select('+password');
    } else {
      data = await this.userModel
        .findOne({
          email: user.email
        })
        .select('+password');
    }

    if (!data) {
      throw new NotFoundError('User not found');
    }

    const matchPassResult = await data.matchPassword(user.password);
    if (!matchPassResult) {
      throw new HttpError(401, 'Invalid credentials');
    }

    return {
      id: data._id,
      token: data.getSignedJwtToken()
    };
  }
}
