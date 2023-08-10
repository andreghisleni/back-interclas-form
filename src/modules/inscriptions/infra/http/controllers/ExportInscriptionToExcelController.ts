import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ExportToExcelService } from '@modules/inscriptions/services/ExportToExcelService';

export class ExportInscriptionToExcelController {
  public async index(req: Request, res: Response): Promise<Response> {
    const exportToExcel = container.resolve(ExportToExcelService);

    const file = await exportToExcel.execute();
    return res.json(file);
  }
}
