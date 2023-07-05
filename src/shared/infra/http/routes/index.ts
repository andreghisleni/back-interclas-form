import { Router } from 'express';

import { inscriptionsRouter } from '@modules/inscriptions/infra/http/routes/inscriptions.routes';
import { passwordRouter } from '@modules/users/infra/http/routes/password.routes';
import { profileRouter } from '@modules/users/infra/http/routes/profile.routes';
import { sessionsRouter } from '@modules/users/infra/http/routes/sessions.routes';
import { usersRoutes } from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

routes.use('/inscriptions', inscriptionsRouter);

export { routes };
