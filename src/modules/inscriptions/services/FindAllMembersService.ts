import { inject, injectable } from 'tsyringe';

import {
  IMemberAll,
  IMembersRepository,
} from '../repositories/IMembersRepository';

@injectable()
export class FindAllMembersService {
  constructor(
    @inject('MembersRepository')
    private membersRepository: IMembersRepository,
  ) { } // eslint-disable-line
  public async execute(): Promise<IMemberAll[]> {
    const members = await this.membersRepository.findAll();

    return members;
  }
}
