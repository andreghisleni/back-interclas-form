import { NextFunction, Request, Response } from 'express';
import { verify, TokenExpiredError } from 'jsonwebtoken';

import auth from '@config/auth';

import { AppError } from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  refreshToken: boolean;
  client: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing - 1', 401);
  }
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, auth.jwt.secret);

    const { sub, refreshToken, client } = decoded as ITokenPayload;
    if (refreshToken) {
      throw new AppError('Invalid JWT token - 2', 401);
    }
    req.user = {
      id: sub,
      client_id: client || '',
    };

    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AppError('Expired_JWT_token', 401);
    } else {
      throw new AppError(`Invalid JWT token - ${(err as any).message}`, 401);// eslint-disable-line
    }
  }
}
