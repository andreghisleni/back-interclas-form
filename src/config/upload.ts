import { env } from '@env';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;
  downloadsFolder: string;

  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {}; // eslint-disable-line
    aws: {
      bucket: string;
      region: string;
    };
  };
}
export const uploadConfig = {
  driver: env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  downloadsFolder: path.resolve(tmpFolder, 'downloads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname
          .split(' ')
          .join('_')}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    disk: {},
    aws: {
      bucket: 'interclas-files',
      region: 'us-east-2',
    },
  },
} as IUploadConfig;
