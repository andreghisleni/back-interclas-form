import { container } from 'tsyringe';

import '@modules/users/providers';

import './providers';

import './providers/BackendJobs';
import { InscriptionsRepository } from '@modules/inscriptions/infra/prisma/repositories/InscriptionsRepository';
import { MembersRepository } from '@modules/inscriptions/infra/prisma/repositories/MembersRepository';
import { IInscriptionsRepository } from '@modules/inscriptions/repositories/IInscriptionsRepository';
import { IMembersRepository } from '@modules/inscriptions/repositories/IMembersRepository';
import { UsersRepository } from '@modules/users/infra/prisma/repositories/UsersRepository';
import { UserTokensRepository } from '@modules/users/infra/prisma/repositories/UserTokensRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/users/repositories/IUserTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IInscriptionsRepository>(
  'InscriptionsRepository',
  InscriptionsRepository,
);

container.registerSingleton<IMembersRepository>(
  'MembersRepository',
  MembersRepository,
);
