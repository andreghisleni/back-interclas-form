import { inject, injectable } from 'tsyringe';

import { IUser, IUsersRepository } from '../repositories/IUsersRepository';

@injectable()
export class FindAllUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }// eslint-disable-line

  public async execute(): Promise<IUser[]> {
    const user = await this.usersRepository.findAll();

    return user;
  }
}
