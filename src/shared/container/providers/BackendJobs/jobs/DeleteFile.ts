import fs from 'fs/promises';
import { container, injectable } from 'tsyringe';

import { IJobDTO } from '../dtos/IJobDTO';

interface IDataProps {
  filePath: string;
}

@injectable()
class Handle {
  constructor() {} // eslint-disable-line

  public async execute({
    data: { filePath },
  }: {
    data: IDataProps;
  }): Promise<void> {
    try {
      await fs.stat(filePath);
    } catch {
      return;
    }
    await fs.unlink(filePath);
  }
}

const job: IJobDTO = {
  key: 'DeleteFile',
  defaultJobOptions: {
    delay: 1000 * 60 * 15, // 15 minutes
  },
  handle: async ({ data }: { data: IDataProps }): Promise<void> => {
    const handle = container.resolve(Handle);
    await handle.execute({ data });
  },
};

export default job;
