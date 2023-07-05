import { userTransform } from '@utils/transform';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserByAnotherUserService } from '../../../services/CreateUserByAnotherUserService';

export class UserByotherUserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const createUser = container.resolve(CreateUserByAnotherUserService);
    const user = await createUser.execute({
      name,
      email,
    });

    return res.json(userTransform(user as any));
  }
}
