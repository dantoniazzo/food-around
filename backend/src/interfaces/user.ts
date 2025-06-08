import { Restaurant } from './restaurants';

export interface UserLogin {
  name?: string;
  email?: string;
  password: string;
}

export interface User extends UserLogin {
  password: string;
  confirmEmailToken?: string;
  isEmailConfirmed?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  resetPasswordConfirmed?: boolean;
  photo?: string;
  createdAt?: Date;
  favorites?: Array<Restaurant>;
}
