import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
export const decodeJwt = (token: string) => {
  return jwt.verify(token, env.jwt.secret as string) as JwtPayload & {
    id: string;
  };
};
