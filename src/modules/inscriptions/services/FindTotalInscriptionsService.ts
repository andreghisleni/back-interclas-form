import { inject, injectable } from 'tsyringe';

import { IInscriptionsRepository } from '../repositories/IInscriptionsRepository';
import { IMembersRepository } from '../repositories/IMembersRepository';

interface IResponse {
  inscriptions: number;
  members: {
    total: number;
    types: {
      [key: string]: number;
    };
  };
}

@injectable()
export class FindTotalInscriptionsService {
  constructor(
    @inject('InscriptionsRepository')
    private inscriptionsRepository: IInscriptionsRepository,

    @inject('MembersRepository')
    private membersRepository: IMembersRepository,
  ) { } // eslint-disable-line
  public async execute(): Promise<IResponse> {
    const totalInscriptions = await this.inscriptionsRepository.count();

    const members = await this.membersRepository.count();
    const membersTypes =
      await this.membersRepository.findAllTypesAndCountMembers();

    const parseMembersTypes = membersTypes
      .map(type => ({
        key: type.name,
        value: type._count.members,
      }))
      .reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});

    return {
      inscriptions: totalInscriptions,
      members: {
        total: members,
        types: parseMembersTypes,
      },
    };
  }
}
