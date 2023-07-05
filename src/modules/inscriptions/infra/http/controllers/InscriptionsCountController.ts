import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindTotalInscriptionsService } from '@modules/inscriptions/services/FindTotalInscriptionsService';

export class InscriptionsCountController {
  public async index(req: Request, res: Response): Promise<Response> {
    const findTotalInscriptions = container.resolve(
      FindTotalInscriptionsService,
    );

    const totalInscriptions = await findTotalInscriptions.execute();

    return res.json(totalInscriptions);
  }
}
