import { env } from '@env';

interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    smtp: {
      email: string;
      pass: string;
      host: string;
    };
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: env.MAIL_DRIVER || 'ethereal',

  defaults: {
    smtp: {
      email: env.MAIL_USER || 'non',
      pass: env.MAIL_PASS || 'non',
      host: env.MAIL_HOST || 'non',
    },
    from: {
      email: 'envio@andreg.com.br',
      name: env.APP_NAME || 'Equipe AGSolutions',
    },
  },
} as IMailConfig;
