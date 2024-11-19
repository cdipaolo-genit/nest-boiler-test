import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepository) {}

  async use(req: Request & { user: User }, res: Response, next: NextFunction) {
    console.log('LOGIC FOR LOGIN REQUEST');

    const authBasic = req.headers.authorization;

    if (!authBasic) return next();

    const credentials = Buffer.from(
      authBasic?.split('Basic ')[1],
      'base64',
    ).toString();

    const [email, password] = credentials.split(':');

    console.log(email, password);

    const [users] = await this.userRepository.find({
      filters: { email: { $eq: email }, password: { $eq: password } },
      relations: { roles: '*' },
    } as any);

    const user = users[0];

    req.user = user;
    next();
  }
}
