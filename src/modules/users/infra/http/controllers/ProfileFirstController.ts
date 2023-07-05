import { userTransform } from '@utils/transform';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateProfileFirstService } from '@modules/users/services/UpdateProfileFirstService';

export class ProfileFirstController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, user: userName, old_password, password } = req.body;

    const updateProfile = container.resolve(UpdateProfileFirstService);
    const user = await updateProfile.execute({
      user_id: req.user.id,
      name,
      email,
      user: userName,
      password,
      old_password,
    });

    return res.json(userTransform(user));
  }
}
