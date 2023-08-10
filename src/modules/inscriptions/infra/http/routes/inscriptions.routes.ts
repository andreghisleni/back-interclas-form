import { Router } from 'express';
import multer from 'multer';

import { uploadConfig } from '@config/upload';

import { ensureAuthenticated } from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { ExportInscriptionToExcelController } from '../controllers/ExportInscriptionToExcelController';
import { FileUploadController } from '../controllers/FileUploadController';
import { InscriptionsController } from '../controllers/InscriptionsController';
import { InscriptionsCountController } from '../controllers/InscriptionsCountController';
import { MembersController } from '../controllers/MembrsController';

const inscriptionsRouter = Router();
const inscriptionsController = new InscriptionsController();
const inscriptionsCountController = new InscriptionsCountController();
const fileUploadController = new FileUploadController();
const membersController = new MembersController();
const exportInscriptionToExcelController =
  new ExportInscriptionToExcelController();

const upload = multer(uploadConfig.multer);

// inscriptionsRouter.get('/', inscriptionsController.index);

inscriptionsRouter.get('/members', membersController.index);
inscriptionsRouter.get(
  '/members/all',
  ensureAuthenticated,
  membersController.index2,
);

inscriptionsRouter.post('/subscribe', inscriptionsController.create);

inscriptionsRouter.post(
  '/subscribe/upload',
  upload.single('file'),
  fileUploadController.create,
);

inscriptionsRouter.get('/count', inscriptionsCountController.index);
inscriptionsRouter.get('/export', exportInscriptionToExcelController.index);

export { inscriptionsRouter };
