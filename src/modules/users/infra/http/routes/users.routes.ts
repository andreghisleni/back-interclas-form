import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { UserByotherUserController } from '../controllers/UserByotherUserController';
import { UsersController } from '../controllers/UsersController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const usersRoutes = Router();
const usersController = new UsersController();
const userByOtherUserController = new UserByotherUserController();

usersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      user: Joi.string().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  usersController.create,
);

usersRoutes.post(
  '/new',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  ensureAuthenticated,
  userByOtherUserController.create,
);

usersRoutes.get('/', ensureAuthenticated, usersController.index);

export { usersRoutes };
