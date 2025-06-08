import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  IsOptional
} from 'class-validator';
import { UserLogin } from '../interfaces/user';

export class UserLoginAttributes implements UserLogin {
  @IsOptional()
  @IsEmail(undefined, {
    message: 'Please add a valid email'
  })
  email: string;

  @IsOptional()
  @MinLength(3, {
    message: 'Minimum name length is 3 characters'
  })
  @MaxLength(15, {
    message: 'Maximum name length is 15 characters'
  })
  name: string;

  @IsOptional()
  @IsString()
  password: string;
}

export class UserAttributes extends UserLoginAttributes {
  token?: string;
}
