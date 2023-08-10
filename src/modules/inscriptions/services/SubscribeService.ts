import { env } from '@env';
import { Member } from '@prisma/client';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';

import { IInscriptionsRepository } from '../repositories/IInscriptionsRepository';
import { IMembersRepository } from '../repositories/IMembersRepository';

interface IRequest {
  cla_name: string;

  scout_group: {
    name: string;
    number: string;
    city: string;
    state: string;
    district_name: string;
  };

  payment: {
    pix_key?: string;
    bank?: string;
    agency?: string;
    account?: string;
    holder: { name: string; document: string };
  };

  responsable: {
    name: string;
    email: string;
    phone: string;
  };

  receipt_file: string;

  members?: {
    name: string;
    sex: string;
    register: string;
    arrive_for_lunch: boolean;

    restrictions: {
      alimentation: string;
      health: string;
    };
    type: string;
  }[];

  staff?: {
    name: string;
    sex: string;
    register: string;
    arrive_for_lunch: boolean;

    function: string;
    can_assist_in: string;

    restrictions: {
      alimentation: string;
      health: string;
    };
  }[];

  drivers?: {
    name: string;
    arrive_for_lunch: boolean;

    restrictions: {
      alimentation: string;
      health: string;
    };
  }[];
}
@injectable()
export class SubscribeService {
  constructor(
    @inject('InscriptionsRepository')
    private inscriptionsRepository: IInscriptionsRepository,

    @inject('MembersRepository')
    private membersRepository: IMembersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) { } // eslint-disable-line

  public async execute({
    cla_name,
    scout_group,
    payment,
    responsable,
    receipt_file,
    members,
    staff,
    drivers,
  }: IRequest): Promise<void> {
    const member_types = await this.membersRepository.findAllTypes();

    const inscription = await this.inscriptionsRepository.create({
      cla_name,
      scout_group_name: scout_group.name,
      scout_group_number: scout_group.number,
      scout_group_city: scout_group.city,
      scout_group_state: scout_group.state,
      scout_group_district_name: scout_group.district_name,
      pix_key: payment.pix_key,
      bank: payment.bank,
      agency: payment.agency,
      account: payment.account,
      holder_name: payment.holder.name,
      holder_document: payment.holder.document,
      responsable_name: responsable.name,
      responsable_email: responsable.email,
      responsable_phone: responsable.phone,
      receipt_file,
    });

    let parseMembers = [] as Member[];

    if (members) {
      parseMembers = members.map(member => ({
        name: member.name,
        sex: member.sex,
        register: member.register,
        arrive_for_lunch: member.arrive_for_lunch,
        alimentation_restrictions: member.restrictions.alimentation,
        health_restrictions: member.restrictions.health,
        member_type_id:
          member_types.find(type => type.name === member.type)?.id ||
          member_types[0].id,
        inscription_id: inscription.id,
      })) as Member[];
    }

    let parseStaff = [] as Member[];

    if (staff) {
      parseStaff = staff.map(member => ({
        name: member.name,
        sex: member.sex,
        register: member.register,
        arrive_for_lunch: member.arrive_for_lunch,

        function: member.function,
        can_assist_in: member.can_assist_in,

        alimentation_restrictions: member.restrictions.alimentation,
        health_restrictions: member.restrictions.health,

        member_type_id:
          member_types.find(type => type.name === 'mestre')?.id ||
          member_types[0].id,
        inscription_id: inscription.id,
      })) as Member[];
    }

    let parseDrivers = [] as Member[];

    if (drivers) {
      parseDrivers = drivers.map(member => ({
        name: member.name,
        arrive_for_lunch: member.arrive_for_lunch,

        alimentation_restrictions: member.restrictions.alimentation,
        health_restrictions: member.restrictions.health,

        member_type_id:
          member_types.find(type => type.name === 'motorista')?.id ||
          member_types[0].id,

        inscription_id: inscription.id,
      })) as Member[];
    }

    await Promise.all(
      [...parseMembers, ...parseStaff, ...parseDrivers].map(member =>
        this.membersRepository.create(member),
      ),
    );

    const confirmEmailTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'confirm_email.hbs',
    );
    await this.mailProvider.sendMail({
      to: {
        name: responsable.name,
        email: responsable.email,
      },
      subject: `[${env.APP_NAME}] Confirmação de inscrição`,
      templateData: {
        file: confirmEmailTemplate,
        variables: {
          name: responsable.name,
          cla: cla_name,
          members: parseMembers.length,
          staff: parseStaff.length,
          drivers: parseDrivers.length,
        },
      },
    });
  }
}
