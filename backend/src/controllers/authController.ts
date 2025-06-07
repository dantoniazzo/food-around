import {
  Body,
  HttpCode,
  JsonController,
  Post,
  UseAfter,
  QueryParam,
  Param,
  Get,
  Res,
  Put,
} from 'routing-controllers';
import { UserLoginDto } from '../dto/user';
import { UserDto } from '../dto/user';
import { ErrorHandlerMiddleware } from '../middlewares/errorMiddleware';
import { AuthService } from '../services/authService';
import { Service } from 'typedi';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Response } from 'express';
import { env } from '../config/env';

@JsonController('/auth')
@Service()
@UseAfter(ErrorHandlerMiddleware)
@OpenAPI({ security: [{ basicAuth: [] }] })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  @ResponseSchema(UserDto)
  public register(@Body() body: UserDto) {
    return this.authService.register(body.data.attributes);
  }

  @Get('/verify/email')
  @ResponseSchema(UserDto)
  public async verify(
    @Res() response: Response,
    @QueryParam('token') token: string
  ) {
    try {
      const user: UserDto = await this.authService.verify(token);
      response
        .cookie('token', user.data.attributes.token, {
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .redirect(`${env.frontend.url}/dashboard`);
    } catch (err) {
      response.redirect(`${env.frontend.url}/email-verification-error`);
    }

    return response;
  }

  @Get('/resend')
  @HttpCode(204)
  public async resend(@QueryParam('email') email: string) {
    return this.authService.resend(email);
  }

  @Get('/forgotpassword')
  @HttpCode(204)
  public async forgotPassword(@QueryParam('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Get('/verify/password')
  @HttpCode(200)
  public async verifyPasswordToken(
    @Res() response: Response,
    @QueryParam('token') token: string
  ) {
    let redirectPage: string;
    try {
      await this.authService.verifyResetPasswordToken(token);
      redirectPage = 'reset-password';
    } catch (err) {
      redirectPage = 'password-reset-error';
    }

    return response.redirect(`${env.frontend.url}/${redirectPage}`);
  }

  @Put('/resetpassword')
  @HttpCode(200)
  public async resetPassword(
    @Res() response: Response,
    @Body() resetBody: UserLoginDto
  ) {
    const user: UserDto = await this.authService.resetPassword(
      resetBody.data.attributes.email,
      resetBody.data.attributes.password
    );
    return response
      .cookie('token', user.data.attributes.token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .json(user);
  }

  @Post('/login')
  @HttpCode(200)
  @ResponseSchema(UserDto)
  public async login(@Res() response: Response, @Body() body: UserLoginDto) {
    const user: UserDto = await this.authService.login(body.data.attributes);
    return response
      .cookie('token', user.data.attributes.token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .json(user);
  }

  @Get('/logout')
  @HttpCode(200)
  public logout(@Res() response: Response) {
    response.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  }
}
