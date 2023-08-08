import { Member, MemberType, Prisma } from '@prisma/client';

export type IMember = Member &
  Prisma.MemberGetPayload<{
    include: {
      member_type: true;
    };
  }>;

export type IMemberAll = Member &
  Prisma.MemberGetPayload<{
    include: {
      member_type: true;
      inscription: true;
    };
  }>;

export type IMemberType = MemberType &
  Prisma.MemberTypeGetPayload<{
    include: {
      _count: {
        select: {
          members: true;
        };
      };
    };
  }>;

export interface IMembersRepository {
  findAll(): Promise<IMemberAll[]>;
  create(data: Prisma.MemberUncheckedCreateInput): Promise<Member>;
  save(member: Member): Promise<Member>;
  findAllTypes(): Promise<MemberType[]>;
  count(): Promise<number>;
  findAllTypesAndCountMembers(): Promise<IMemberType[]>;
}
