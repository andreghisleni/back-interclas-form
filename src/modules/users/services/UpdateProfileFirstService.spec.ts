import { describe, it, beforeEach, expect } from 'vitest';

import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { UpdateProfileFirstService } from './UpdateProfileFirstService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;

let updateProfileFirst: UpdateProfileFirstService;
describe('UpdateProfileFirst', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    fakeMailProvider = new FakeMailProvider();
    updateProfileFirst = new UpdateProfileFirstService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeMailProvider,
    );
  });
  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
      first_password: true,
    });

    const updatedUser = await updateProfileFirst.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'john@tre.com',
      user: 'john',
      password: '123456',
      old_password: '123456',
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('john@tre.com');
  });
  it('should not be able update the profile from non-existing user', async () => {
    await expect(
      updateProfileFirst.execute({
        user_id: 'non-existing-user-id',
        name: 'John Trê',
        email: 'john@doe.com',
        user: 'john',
        password: '123456',
        old_password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
      first_password: true,
    });
    const user = await fakeUsersRepository.create({
      name: 'John Doe2',
      email: 'john@doe2.com',
      user: 'john2',
      password: '12345',
      first_password: true,
    });

    await expect(
      updateProfileFirst.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'john@doe.com',
        user: 'john',
        password: '123456',
        old_password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
      first_password: true,
    });

    const updatedUser = await updateProfileFirst.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'john@tre.com',
      old_password: '123456',
      password: '123123',
      user: 'john',
    });

    expect(updatedUser.password).toBe('123123');
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
      first_password: true,
    });

    await expect(
      updateProfileFirst.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'john@tre.com',
        old_password: 'wrong_password',
        password: '123123',
        user: 'john',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the user with another exists user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
      first_password: true,
    });

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john2',
      password: '123456',
      first_password: true,
    });

    await expect(
      updateProfileFirst.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'john@tre.com',
        old_password: 'wrong_password',
        password: '123123',
        user: 'john2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
