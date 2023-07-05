import { isAfter } from 'date-fns';
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';
import ms from 'ms';
import { injectable, inject } from 'tsyringe';

import auth from '@config/auth';

import { AppError } from '@shared/errors/AppError';

import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequest {
  refreshToken: string;
}
interface IResponse {
  token: string;
  refreshToken: string;
}

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  refreshToken: boolean;
  passwordUpdated: number;
  expirete: number;
  client: string;
}

@injectable()
export class RefreshTokenService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }// eslint-disable-line

  public async execute({ refreshToken }: IRequest): Promise<IResponse> {
    const { secret, expiresIn, expiresInRefresh } = auth.jwt;

    try {
      const decoded = verify(refreshToken, secret);

      const {
        sub,
        refreshToken: isRefreshToken,
        expirete,
        client,
      } = decoded as ITokenPayload;

      const user = await this.usersRepository.findById(sub);

      if (!user || !isRefreshToken) {
        throw new AppError('Invalid tokens.', 401);
      }

      let RToken = refreshToken;

      if (isAfter(expirete, Date.now() + ms('1d'))) {
        RToken = sign(
          {
            refreshToken: true,
            expirete: new Date(Date.now() + ms(expiresInRefresh)).getTime(),
            client,
          },
          secret,
          {
            subject: user.id,
            expiresIn: expiresInRefresh,
          },
        );
      }

      const token = sign({ refreshToken: false, client }, secret, {
        subject: user.id,
        expiresIn,
      });
      return { token, refreshToken: RToken };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new AppError('Expired_JWT_Refresh_token', 401);
      } else {
        throw new AppError('Invalid JWT Refresh token', 401);
      }
    }
  }
}
