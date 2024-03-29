import { userTransform } from '@utils/transform';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserService } from '@modules/users/services/AuthenticateUserService';
import { RefreshTokenService } from '@modules/users/services/RefreshTokenService';

// import { lookup } from 'geoip-lite';

export class SessionsController {
  async create(req: Request, res: Response): Promise<Response> {
    const { user: userName, password } = req.body;

    const authUser = container.resolve(AuthenticateUserService);

    const { user, token, refreshToken } = await authUser.execute({
      user: userName,
      password,
    });

    return res.json({ user: userTransform(user), token, refreshToken });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.body;

    const refresh = container.resolve(RefreshTokenService);

    const { token, refreshToken: RToken } = await refresh.execute({
      refreshToken,
    });

    return res.json({ token, refreshToken: RToken });
  }
}
