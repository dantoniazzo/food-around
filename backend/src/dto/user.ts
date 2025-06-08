import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  ValidateNested,
  IsString,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { Identifier } from './index';
import { UserLogin } from '../interfaces/user';
import { Restaurant } from '../interfaces/restaurants';

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

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserAttributes extends UserLoginAttributes {
  token?: string;
  favorites?: Restaurant[];
}
