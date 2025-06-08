import {
  Body,
  HttpCode,
  JsonController,
  Post,
  UseAfter,
  Get,
  Res
} from 'routing-controllers';
import { ErrorHandlerMiddleware } from '../middlewares/errorMiddleware';
import { AuthService } from '../services/authService';
import { Service } from 'typedi';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Response } from 'express';
import { UserLoginAttributes } from '../dto/user';

@JsonController('/auth')
@Service()
@UseAfter(ErrorHandlerMiddleware)
@OpenAPI({ security: [{ basicAuth: [] }] })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  @ResponseSchema(UserLoginAttributes)
  public async register(
    @Res() response: Response,
    @Body() body: UserLoginAttributes
  ) {
    const userData = await this.authService.register(body);
    return response
      .cookie('token', userData.token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })
      .json(userData);
  }

  @Post('/login')
  @HttpCode(200)
  @ResponseSchema(UserLoginAttributes)
  public async login(
    @Res() response: Response,
    @Body() body: UserLoginAttributes
  ) {
    const user = await this.authService.login(body);
    return response
      .cookie('token', user.token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })
      .json(user);
  }

  @Get('/logout')
  @HttpCode(200)
  public logout(@Res() response: Response) {
    response.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
  }
}
