import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { ProfileController } from '../controllers/ProfileController';
import { ProfileFirstController } from '../controllers/ProfileFirstController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();
const profileFirstController = new ProfileFirstController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);
profileRouter.put(
  '/first',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      user: Joi.string().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileFirstController.update,
);

export { profileRouter };
