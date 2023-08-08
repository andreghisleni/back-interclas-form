import { memberTransform } from '@utils/transform';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindAllMembersService } from '@modules/inscriptions/services/FindAllMembersService';

export class MembersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const findAllMembers = container.resolve(FindAllMembersService);
    const members = await findAllMembers.execute();

    return res.json(
      members.map(member => ({
        id: member.id,
        name: member.name,
        arrive_for_lunch: member.arrive_for_lunch,
        sex: member.sex,

        member_type: member.member_type,
        inscription: {
          id: member.inscription.id,
          4: member.inscription.cla_name,
        },
      })),
    );
  }
  public async index2(req: Request, res: Response): Promise<Response> {
    const findAllMembers = container.resolve(FindAllMembersService);
    const members = await findAllMembers.execute();

    return res.json(memberTransform(members));
  }
}
