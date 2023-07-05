import { User, Prisma } from '@prisma/client';

import { prisma } from '@shared/infra/prisma';

import {
  IUser,
  IUsersRepository,
} from '@modules/users/repositories/IUsersRepository';

const include = {
  // permissions: true,
  // permission_groups: {
  //   include: {
  //     permissions: true,
  //   },
  // },
};
export class UsersRepository implements IUsersRepository {
  public async findById(id: string): Promise<IUser | undefined> {
    const findUser = await prisma.user.findUnique({
      where: { id },
      // include,
    });

    return findUser || undefined;
  }

  public async findAll(): Promise<IUser[]> {
    const findUsers = await prisma.user.findMany({
      // include,
    });

    return findUsers;
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    const findUser = await prisma.user.findUnique({
      where: { email },
      // include,
    });
    return findUser || undefined;
  }

  public async findByUser(user: string): Promise<IUser | undefined> {
    const findUser = await prisma.user.findUnique({
      where: { user },
      // include,
    });
    return findUser || undefined;
  }

  public async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  public async save(user: User): Promise<User> {
    const u: any = {
      ...user,
      clients: undefined,
    };
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: u,
    });

    return updatedUser;
  }

  // public async linkUserToPermissionGroup(
  //   user_id: string,
  //   permission_group_id: string,
  // ): Promise<void> {
  //   await prisma.user.update({
  //     where: { id: user_id },
  //     data: {
  //       permission_groups: {
  //         connect: {
  //           id: permission_group_id,
  //         },
  //       },
  //     },
  //   });
  // }

  // public async unlinkUserFromPermissionGroup(
  //   user_id: string,
  //   permission_group_id: string,
  // ): Promise<void> {
  //   await prisma.user.update({
  //     where: { id: user_id },
  //     data: {
  //       permission_groups: {
  //         disconnect: {
  //           id: permission_group_id,
  //         },
  //       },
  //     },
  //   });
  // }
}
