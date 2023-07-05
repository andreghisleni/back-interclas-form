import { env } from '@env';
import { User } from '@prisma/client';
import path from 'path';
import { injectable, inject } from 'tsyringe';

import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { AppError } from '@shared/errors/AppError';

import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  user: string;
  old_password: string;
  password: string;
}
@injectable()
export class UpdateProfileFirstService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) { }// eslint-disable-line

  public async execute({
    user_id,
    name,
    email,
    user: userName,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change profile');
    }
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('E-mail already in use.');
    }
    const userWithUpdatedUserName = await this.usersRepository.findByUser(
      userName,
    );

    if (userWithUpdatedUserName && userWithUpdatedUserName.id !== user.id) {
      throw new AppError('User already in use.');
    }

    user.name = name;
    user.email = email;

    user.user = userName;

    const checkOldPassword = await this.hashProvider.compareHash(
      old_password,
      user.password,
    );

    if (!checkOldPassword) {
      throw new AppError('Old password does not match.');
    }
    user.password = await this.hashProvider.generateHash(password);

    if (user.first_password === true) {
      user.first_password = false;
    }

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'update_data_email.hbs',
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
        },
      },
    });

    user.clients = [];

    return this.usersRepository.save(user);
  }
}
