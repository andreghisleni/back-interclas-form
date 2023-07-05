import { userTransform } from '@utils/transform';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '@modules/users/services/CreateUserService';
import { FindAllUsersService } from '@modules/users/services/FindAllUsersService';

export class UsersController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, user: userName, password } = req.body;

    const createUser = container.resolve(CreateUserService);
    const user = await createUser.execute({
      name,
      email,
      password,
      user: userName,
    });

    return res.json(userTransform(user));
  }

  async index(req: Request, res: Response): Promise<Response> {
    const findAllUsers = container.resolve(FindAllUsersService);
    const users = await findAllUsers.execute();
    return res.json(userTransform(users));
  }
}
