import { describe, it, beforeEach, expect } from 'vitest';

import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { AuthenticateUserService } from './AuthenticateUserService';
import { CreateUserService } from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
    });

    user.clients = [
      {
        id: 'client_id',
        name: 'Client Test',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await fakeUsersRepository.save(user);

    const response = await authenticateUser.execute({
      user: 'john',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should be able to authenticate in global network', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      user: 'john',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
  it('should not be able to authenticate with none exists user', async () => {
    await expect(
      authenticateUser.execute({
        user: 'john',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        user: 'john',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
