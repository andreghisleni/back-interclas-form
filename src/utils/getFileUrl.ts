import { uploadConfig } from '@config/upload';
import { env } from '@env';

export const getFileUrl = (
  file: string | null,
  folder?: string,
): string | null => {
  if (!file) {
    return null;
  }
  const f = folder ? `${folder}/` : '';
  switch (uploadConfig.driver) {
    case 'disk':
      return `${env.APP_API_URL}/files/${f}${file}`;
    case 's3':
      return `https://${uploadConfig.config.aws.bucket}.s3.${uploadConfig.config.aws.region}.amazonaws.com/${f}${file}`;
    default:
      return null;
  }
};
