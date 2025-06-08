import { useContainer, useExpressServer } from 'routing-controllers';
import { env } from '../config/env';
import { Container } from 'typedi';
import express from 'express';
import { AuthController } from '../controllers/authController';
import { UserController } from '../controllers/userController';
import { ErrorHandlerMiddleware } from '../middlewares/errorMiddleware';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xXssProtection from 'x-xss-protection';
import hpp from 'hpp';
import { AuthMiddleware } from '../middlewares/authMiddleware';

export const serverLoader = () => {
  const app = express();

  app.use(cookieParser());
  if (process.env.NODE_ENV !== 'development') {
    console.info('Setting security...');
    app.use(mongoSanitize());
    app.use(helmet());
    app.use(xXssProtection());
    app.use(hpp());
  }

  useExpressServer(app, {
    cors: {
      origin: env.frontend.url as string,
      credentials: true
    },
    controllers: [AuthController, UserController],
    middlewares: [ErrorHandlerMiddleware, AuthMiddleware],
    routePrefix: env.app.routePrefix,
    defaults: {
      //with this option, null will return 404 by default
      nullResultCode: 404,

      //with this option, void or Promise<void> will return 204 by default
      undefinedResultCode: 204
    },
    classTransformer: true,
    validation: true,
    defaultErrorHandler: false
  });

  // its important to set container before any operation you do with routing-controllers,
  // including importing controllers
  useContainer(Container);

  app.listen(env.app.port, () => {
    console.log(`Serving on port ${env.app.port}`);
  });
};
