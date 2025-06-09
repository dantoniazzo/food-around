import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${process.env.NODE_ENV === 'development' ? '.dev' : ''}`
  )
});

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  app: {
    port: process.env.PORT || '5000'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    cookie_exp: process.env.JWT_COOKIE_EXPIRE
  },
  db: {
    uri: process.env.MONGODB_URI
  },
  frontend: {
    url: process.env.FRONTEND_URL
  }
};
