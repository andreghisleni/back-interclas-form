import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime';
import path from 'path';

import { uploadConfig } from '@config/upload';

import type { IStorageProvider } from '../models/IStorageProvider';

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: uploadConfig.config.aws.region,
    });
  }

  public async saveFile(file: string, folder?: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }
    const fileContent = await fs.promises.readFile(originalPath);

    await this.client.send(
      new PutObjectCommand({
        Bucket: uploadConfig.config.aws.bucket,
        Key: `${folder ? `${folder}/` : ''}${file}`,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      }),
    );

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string, folder?: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: uploadConfig.config.aws.bucket,
        Key: `${folder ? `${folder}/` : ''}${file}`,
      }),
    );
  }
}
