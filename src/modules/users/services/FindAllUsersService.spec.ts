import { describe, it, beforeEach, expect } from 'vitest';

import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { FindAllUsersService } from './FindAllUsersService';

let fakeUsersRepository: FakeUsersRepository;
let findAllUsers: FindAllUsersService;

describe('FindAllUsersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    findAllUsers = new FindAllUsersService(fakeUsersRepository);
  });
  it('should be able find all users', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      user: 'john',
      password: '123456',
      first_password: false,
    });
    await fakeUsersRepository.create({
      name: 'John Doe 2',
      email: 'john2@doe.com',
      user: 'john2',
      password: '1234562',
      first_password: false,
    });

    const response = await findAllUsers.execute();

    expect(response).toHaveLength(2);
  });
});
