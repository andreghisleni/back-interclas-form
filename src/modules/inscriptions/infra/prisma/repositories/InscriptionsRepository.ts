import { Inscription, Prisma } from '@prisma/client';

import { prisma } from '@shared/infra/prisma';

import {
  IInscription,
  IInscriptionsRepository,
} from '@modules/inscriptions/repositories/IInscriptionsRepository';

export class InscriptionsRepository implements IInscriptionsRepository {
  public async findAll(): Promise<IInscription[]> {
    const findInscriptions = await prisma.inscription.findMany({
      include: {
        members: {
          include: {
            member_type: true,
          },
        },
      },
    });

    return findInscriptions;
  }

  public async create(
    data: Prisma.InscriptionUncheckedCreateInput,
  ): Promise<Inscription> {
    const inscription = await prisma.inscription.create({
      data,
    });

    return inscription;
  }

  public async save(inscription: Inscription): Promise<Inscription> {
    const updatedInscription = await prisma.inscription.update({
      where: { id: inscription.id },
      data: inscription,
    });

    return updatedInscription;
  }

  public async count(): Promise<number> {
    const count = await prisma.inscription.count();

    return count;
  }
}
