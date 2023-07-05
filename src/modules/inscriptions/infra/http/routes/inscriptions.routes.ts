import { Router } from 'express';
import multer from 'multer';

import { uploadConfig } from '@config/upload';

import { FileUploadController } from '../controllers/FileUploadController';
import { InscriptionsController } from '../controllers/InscriptionsController';
import { InscriptionsCountController } from '../controllers/InscriptionsCountController';

const inscriptionsRouter = Router();
const inscriptionsController = new InscriptionsController();
const inscriptionsCountController = new InscriptionsCountController();
const fileUploadController = new FileUploadController();

const upload = multer(uploadConfig.multer);

// inscriptionsRouter.get('/', inscriptionsController.index);

inscriptionsRouter.post('/subscribe', inscriptionsController.create);

inscriptionsRouter.post(
  '/subscribe/upload',
  upload.single('file'),
  fileUploadController.create,
);

inscriptionsRouter.get('/count', inscriptionsCountController.index);

export { inscriptionsRouter };
