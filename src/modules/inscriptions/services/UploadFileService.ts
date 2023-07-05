import { inject, injectable } from 'tsyringe';

import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  fileFileName: string;
}
@injectable()
export class UploadFileService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) { } // eslint-disable-line

  public async execute({ fileFileName }: IRequest): Promise<{
    file: string;
  }> {
    const fileName = await this.storageProvider.saveFile(fileFileName);

    return {
      file: fileName,
    };
  }
}
