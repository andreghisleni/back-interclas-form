import 'reflect-metadata';

import { errors } from 'celebrate';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import { ZodError } from 'zod';

import { uploadConfig } from '@config/upload';

import { AppError } from '@shared/errors/AppError';

import { rateLimiter } from './middlewares/rateLimiter';
import { routes } from './routes';

import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.set('trust proxy', true);
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use('/files/download', express.static(uploadConfig.downloadsFolder));
app.use(rateLimiter);
app.use(routes);

app.get('/show-headers', (req, res) => {
  console.log(JSON.stringify(req.headers)); // eslint-disable-line no-console

  return res.json(req.headers);
});

app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  if (err instanceof ZodError) {
    return res
      .status(400)
      .send({ message: 'Validation error.', issues: err.format() });
  }

  console.error(err); // eslint-disable-line
  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

export { app };
