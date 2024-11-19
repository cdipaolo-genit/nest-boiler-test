import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { BaseUseCase } from 'src/core/commons/domain/usecases/base-use-case.interface';

@Injectable()
export class SignInUseCase implements BaseUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(): Promise<unknown> {
    return true;
  }
}
