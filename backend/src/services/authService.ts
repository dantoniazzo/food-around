import * as crypto from 'crypto';
import { Document, Model } from 'mongoose';
import { HttpError, NotFoundError } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { env } from '../config/env';
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

  public async verify(token: string) {
    const splitToken = token.split('.')[0];
    const confirmEmailToken = crypto
      .createHash('sha256')
      .update(splitToken)
      .digest('hex');

    // get user by token
    const user = await this.userModel.findOne({
      confirmEmailToken,
      isEmailConfirmed: false
    });

    if (!user) {
      throw new HttpError(400, 'Invalid token');
    }

    // update confirmed to true
    user.confirmEmailToken = undefined;
    user.isEmailConfirmed = true;

    // save
    await user.save({ validateBeforeSave: false });

    return {
      id: user._id,
      token: user.getSignedJwtToken()
    };
  }

  public async resend(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new HttpError(404, 'User with this email not found');
    }

    if (user.isEmailConfirmed) {
      throw new HttpError(400, 'User already confirmed email');
    }

    const confirmEmailToken = user.generateEmailConfirmToken();
    const confirmEmailURL = `${env.app.host}/${env.app.routePrefix}/auth/verify/email?token=${confirmEmailToken}`;
    await user.save({ validateBeforeSave: false });
  }

  public async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new HttpError(404, 'User with this email not found');
    }

    // Reset token
    const resetToken = user.getResetPasswordToken();
    if (user.resetPasswordConfirmed) user.resetPasswordConfirmed = false;
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${env.app.host}/${env.app.routePrefix}/auth/verify/password?token=${resetToken}`;
  }

  public async verifyResetPasswordToken(token: string) {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await this.userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: new Date(Date.now()) }
    });

    if (!user) {
      throw new HttpError(400, 'Invalid token');
    }

    user.resetPasswordConfirmed = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
  }

  public async resetPassword(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    if (!user.resetPasswordConfirmed) {
      throw new HttpError(400, 'User did not confirm reset password email');
    }

    // Set new password
    user.password = password;
    user.resetPasswordConfirmed = false;
    await user.save({ validateBeforeSave: false });

    return {
      id: user._id,
      token: user.getSignedJwtToken()
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
