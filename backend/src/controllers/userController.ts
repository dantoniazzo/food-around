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
  UseBefore
} from 'routing-controllers';
import { ErrorHandlerMiddleware } from '../middlewares/errorMiddleware';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { Response, Request } from 'express';
import { UserAttributes } from '../dto/user';

@JsonController('/user')
@Service()
@UseBefore(AuthMiddleware)
@UseAfter(ErrorHandlerMiddleware)
@OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @HttpCode(200)
  public async me(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies.token;
    return this.userService.getMe(token);
  }

  @Get()
  @HttpCode(200)
  @ResponseSchema(UserAttributes)
  public get(@Req() request: { id: string }) {
    return this.userService.read(request.id);
  }

  @Put()
  @HttpCode(201)
  @ResponseSchema(UserAttributes)
  public put(@Req() request: { id: string }, @Body() body: UserAttributes) {
    console.log('Request received: ', body);
    /* return this.userService.update(request.id, body.data.attributes); */
  }

  @Delete()
  @HttpCode(200)
  public delete(@Req() request: { id: string }) {
    return this.userService.delete(request.id);
  }
}
