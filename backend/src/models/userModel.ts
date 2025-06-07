import { Schema, model } from 'mongoose';
import { User } from '../interfaces/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import * as crypto from 'crypto';

export interface UserDocument extends User {
  matchPassword: (password: string) => Promise<boolean>;
  getSignedJwtToken: () => string;
  getResetPasswordToken: () => string;
  generateEmailConfirmToken: () => string;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please add your name'],
      minlength: 3,
      maxlength: 15,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Please add a valid password. Minimum length is 8 and it should include at least one special character, letter and number',
      ],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetPasswordConfirmed: {
      type: Boolean,
      default: false,
    },
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, env.jwt.secret as string, {
    expiresIn: env.jwt.expire as StringValue,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate email confirm token
UserSchema.methods.generateEmailConfirmToken = function () {
  // email confirmation token
  const confirmationToken = crypto.randomBytes(20).toString('hex');

  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmationToken)
    .digest('hex');

  const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
  const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
  return confirmTokenCombined;
};

export default model<UserDocument>('User', UserSchema);
