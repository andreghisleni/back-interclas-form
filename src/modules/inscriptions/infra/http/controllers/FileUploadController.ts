import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadFileService } from '@modules/inscriptions/services/UploadFileService';

export class FileUploadController {
  public async create(req: Request, res: Response): Promise<Response> {
    const uploadFile = container.resolve(UploadFileService);

    const file = await uploadFile.execute({
      fileFileName: req.file?.filename || '',
    });
    return res.json(file);
  }
}
