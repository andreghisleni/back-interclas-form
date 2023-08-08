import { Member, MemberType, Prisma } from '@prisma/client';

import { prisma } from '@shared/infra/prisma';

import {
  IMemberAll,
  IMemberType,
  IMembersRepository,
} from '@modules/inscriptions/repositories/IMembersRepository';

export class MembersRepository implements IMembersRepository {
  public async findAll(): Promise<IMemberAll[]> {
    const findMembers = await prisma.member.findMany({
      include: {
        member_type: true,
        inscription: true,
      },
    });

    return findMembers;
  }

  public async create(
    data: Prisma.MemberUncheckedCreateInput,
  ): Promise<Member> {
    const member = await prisma.member.create({
      data,
    });

    return member;
  }

  public async save(member: Member): Promise<Member> {
    const updatedMember = await prisma.member.update({
      where: { id: member.id },
      data: member,
    });

    return updatedMember;
  }

  public async findAllTypes(): Promise<MemberType[]> {
    const findMemberTypes = await prisma.memberType.findMany();

    return findMemberTypes;
  }

  public async count(): Promise<number> {
    const count = await prisma.member.count();

    return count;
  }

  public async findAllTypesAndCountMembers(): Promise<IMemberType[]> {
    const findMemberTypes = await prisma.memberType.findMany({
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return findMemberTypes;
  }
}
