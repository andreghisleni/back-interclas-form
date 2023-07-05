import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgotPasswordEmailService } from '@modules/users/services/SendForgotPasswordEmailService';

export class ForgotPasswordController {
  async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendFogotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendFogotPasswordEmail.execute({ email });

    return res.status(204).json();
  }
}
