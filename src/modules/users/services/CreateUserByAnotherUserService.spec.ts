import { describe, it, beforeEach, expect } from 'vitest';

import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { CreateUserByAnotherUserService } from './CreateUserByAnotherUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;

let createUser: CreateUserByAnotherUserService;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeMailProvider = new FakeMailProvider();
    createUser = new CreateUserByAnotherUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeMailProvider,
    );
  });
  it('should be able create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
    });
    expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john@doe.com',
    });
    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'john@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
