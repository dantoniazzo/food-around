import { UserService } from '../services/userService';
import { Service } from 'typedi';
import {
  Body,
  Get,
  JsonController,
  Put,
  Post,
  Delete,
  HttpCode,
  UseAfter,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';
import { UserDto } from '../dto/user';
import { ErrorHandlerMiddleware } from '../middlewares/errorMiddleware';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Request } from 'express';
import { AuthMiddleware } from '../middlewares/authMiddleware';

@JsonController('/user')
@Service()
@UseBefore(AuthMiddleware)
@UseAfter(ErrorHandlerMiddleware)
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(200)
  @ResponseSchema(UserDto)
  public get(@Req() request: Request) {
    return this.userService.read(request.user);
  }

  @Put()
  @HttpCode(201)
  @ResponseSchema(UserDto)
  public put(@Req() request: Request, @Body() body: UserDto) {
    return this.userService.update(request.user, body.data.attributes);
  }

  @Delete()
  @HttpCode(200)
  public delete(@Req() request: Request) {
    return this.userService.delete(request.user);
  }
}
