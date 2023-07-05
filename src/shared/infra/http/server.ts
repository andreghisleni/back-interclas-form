import { prisma } from '../prisma';
import { app } from './app';

const bootstrap = async () => {
  await prisma.$connect();

  app.listen(3333, () => {
    console.log('🚀 Server started on port 3333!'); // eslint-disable-line no-console
  });
};

bootstrap();
