import { User, Prisma } from '@prisma/client';

export type IUser = User &
  Prisma.UserGetPayload<{
    select: {
      // permissions?: true;
      // permission_groups?: {
      //   include: {
      //     permissions?: true;
      //   };
      // };
    };
  }>;

export interface IUsersRepository {
  findById(id: string): Promise<IUser | undefined>;
  findAll(): Promise<IUser[]>;
  findByUser(user: string): Promise<IUser | undefined>;
  findByEmail(email: string): Promise<IUser | undefined>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  save(user: User): Promise<User>;

  // linkUserToPermissionGroup(
  //   user_id: string,
  //   permission_group_id: string,
  // ): Promise<void>;

  // unlinkUserFromPermissionGroup(
  //   user_id: string,
  //   permission_group_id: string,
  // ): Promise<void>;
}
