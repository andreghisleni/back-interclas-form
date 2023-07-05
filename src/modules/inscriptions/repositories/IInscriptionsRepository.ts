import { Inscription, Prisma } from '@prisma/client';

export type IInscription = Inscription &
  Prisma.InscriptionGetPayload<{
    include: {
      members: {
        include: {
          member_type: true;
        };
      };
    };
  }>;

export interface IInscriptionsRepository {
  findAll(): Promise<IInscription[]>;
  create(data: Prisma.InscriptionUncheckedCreateInput): Promise<Inscription>;
  save(inscription: Inscription): Promise<Inscription>;
  count(): Promise<number>;
}
