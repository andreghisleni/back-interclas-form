import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

import { SubscribeService } from '@modules/inscriptions/services/SubscribeService';

export class InscriptionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const subscribeSchema = z.object({
      cla_name: z.string(),
      scout_group: z.object({
        name: z.string(),
        number: z.string(),
        city: z.string(),
        state: z.string(),
        district_name: z.string(),
      }),
      payment: z.object({
        pix_key: z.string().optional(),
        bank: z.string().optional(),
        agency: z.string().optional(),
        account: z.string().optional(),
        holder: z.object({
          name: z.string(),
          document: z.string(),
        }),
      }),
      responsable: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
      }),
      receipt_file: z.string(),
      members: z.array(
        z.object({
          name: z.string(),
          sex: z.string(),
          register: z.string(),
          restrictions: z.object({
            alimentation: z.string(),
            health: z.string(),
          }),
          type: z.string(),
          arrive_for_lunch: z.coerce.boolean(),
        }),
      ),
      staff: z
        .array(
          z.object({
            name: z.string(),
            sex: z.string(),
            register: z.string(),
            function: z.string(),
            can_assist_in: z.string(),
            arrive_for_lunch: z.coerce.boolean(),
            restrictions: z.object({
              alimentation: z.string(),
              health: z.string(),
            }),
          }),
        )
        .nullable(),
      drivers: z
        .array(
          z.object({
            name: z.string(),
            arrive_for_lunch: z.coerce.boolean(),
            restrictions: z.object({
              alimentation: z.string(),
              health: z.string(),
            }),
          }),
        )
        .nullable(),
    });

    const {
      cla_name,
      scout_group,
      payment,
      responsable,
      receipt_file,
      members,
      staff,
      drivers,
    } = subscribeSchema.parse(req.body);

    const subscribe = container.resolve(SubscribeService);
    await subscribe.execute({
      cla_name,
      scout_group,
      payment,
      responsable,
      receipt_file,
      members: members || undefined,
      staff: staff || undefined,
      drivers: drivers || undefined,
    });
    return res.status(201).json();
  }

  // public async index(req: Request, res: Response): Promise<Response> {
  //   const findAllAccounts = container.resolve(FindAllAccountsService);
  //   const transactions = await findAllAccounts.execute({
  //     client_id: req.user.client_id,
  //   });

  //   return res.json(instanceToInstance(transactions));
  // }
}
