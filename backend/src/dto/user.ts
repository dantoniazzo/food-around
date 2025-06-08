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

class UserLoginAttributes implements UserLogin {
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

class UserLoginObject extends Identifier {
  @ValidateNested()
  @Type(() => UserLoginAttributes)
  attributes: UserLoginAttributes;
}

class UserAttributes extends UserLoginAttributes {
  token?: string;
  favorites?: Restaurant[];
}

class UserObject extends Identifier {
  @ValidateNested()
  @Type(() => UserAttributes)
  attributes: UserAttributes;
}

export class UserDto {
  @ValidateNested()
  @Type(() => UserObject)
  data: UserObject;
}

export class UserLoginDto {
  @ValidateNested()
  @Type(() => UserLoginObject)
  data: UserLoginObject;
}
