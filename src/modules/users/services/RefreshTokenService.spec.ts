import { sign } from 'jsonwebtoken';
import ms from 'ms';
import { describe, it, beforeEach, expect } from 'vitest';

import authConfig from '@config/auth';

import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { AuthenticateUserService } from './AuthenticateUserService';
import { CreateUserService } from './CreateUserService';
import { RefreshTokenService } from './RefreshTokenService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;
let refreshToken: RefreshTokenService;

describe('RefreshTokenService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    refreshToken = new RefreshTokenService(fakeUsersRepository);
  });
  it('should be able to refresh token', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',

      password: '123456',
    });

    const auth = await authenticateUser.execute({
      user: 'john',
      password: '123456',
    });

    const response = await refreshToken.execute({
      refreshToken: auth.refreshToken,
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
  });
  it('should not be able to refresh token to invalid string', async () => {
    await expect(
      refreshToken.execute({
        refreshToken: 'fehtrhtyuytujtr',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to refresh token to invalid token', async () => {
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign(
      {
        refreshToken: false,
      },
      secret,
      {
        expiresIn,
      },
    );
    await expect(
      refreshToken.execute({
        refreshToken: token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to refresh token to expired refreshToken', async () => {
    const { secret, expiresInRefresh } = authConfig.jwt;

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',

      password: '123456',
    });
    await fakeUsersRepository.save(user);

    const token = sign(
      {
        refreshToken: true,
        expirete: new Date(Date.now() - ms(`${expiresInRefresh}`)),
      },
      secret,
      {
        subject: user.id,
        expiresIn: '-1s',
      },
    );

    await expect(
      refreshToken.execute({
        refreshToken: token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able update refresh token 1 day before expire', async () => {
    const { secret, expiresInRefresh } = authConfig.jwt;

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',

      password: '123456',
    });
    await fakeUsersRepository.save(user);

    const token = sign(
      {
        refreshToken: true,
        expirete: new Date(Date.now() - ms(`6d`)).getTime(),
      },
      secret,
      {
        subject: user.id,
        expiresIn: expiresInRefresh,
      },
    );

    const response = await refreshToken.execute({
      refreshToken: token,
    });

    expect(response).toHaveProperty('token');
    expect(response).not.toHaveProperty(token);
  });
});
