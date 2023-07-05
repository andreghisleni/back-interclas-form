import { env } from '@env';
import { User } from '@prisma/client';
import crypto from 'crypto';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { AppError } from '@shared/errors/AppError';

import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
}
@injectable()
export class CreateUserByAnotherUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) { } // eslint-disable-line

  public async execute({ name, email }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }
    const password = crypto.randomBytes(6).toString('hex');
    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.usersRepository.create({
      name,
      email,
      user: email.split('@')[0],
      password: hashedPassword,
      first_password: true,
    });

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'new_user.hbs',
    );
    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: `[${env.APP_NAME}] Recuperação de senha`,
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          url: `${env.APP_WEB_URL}`,
          user: email.split('@')[0],
          password,
        },
      },
    });

    return user;
  }
}
