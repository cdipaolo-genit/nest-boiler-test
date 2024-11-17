import { Injectable } from '@nestjs/common';
import {
  GetAllUseCase,
  GetOneUseCase,
  CreateUseCase,
  UpdateUseCase,
  DeleteUseCase,
} from 'src/core/commons/domain/usecases/crud.usecase';
import { CatRepository } from '../repositories/cat.repository';
import { Cat } from '../entities/cat.entity';

@Injectable()
export class CreateCatUseCase extends CreateUseCase<Cat> {
  constructor(repository: CatRepository) {
    super(repository);
  }
}

@Injectable()
export class GetAllCatsUseCase extends GetAllUseCase<Cat> {
  constructor(repository: CatRepository) {
    super(repository);
  }
}

@Injectable()
export class GetOneCatUseCase extends GetOneUseCase<Cat> {
  constructor(repository: CatRepository) {
    super(repository);
  }
}

@Injectable()
export class DeleteCatUseCase extends DeleteUseCase<Cat> {
  constructor(repository: CatRepository) {
    super(repository);
  }
}

@Injectable()
export class UpdateCatUseCase extends UpdateUseCase<Cat> {
  constructor(repository: CatRepository) {
    super(repository);
  }
}
