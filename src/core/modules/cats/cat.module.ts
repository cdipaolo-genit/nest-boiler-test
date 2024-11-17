import { Module } from '@nestjs/common';
import {
  CreateCatUseCase,
  DeleteCatUseCase,
  GetAllCatsUseCase,
  GetOneCatUseCase,
  UpdateCatUseCase,
} from './domain/usecases/crud-cat.usecase';
import { CatRepository } from './domain/repositories/cat.repository';
import { CatController } from './gateway/controllers/cat.controller';

const useCases = [
  GetOneCatUseCase,
  GetAllCatsUseCase,
  CreateCatUseCase,
  DeleteCatUseCase,
  UpdateCatUseCase,
];

@Module({
  imports: [],
  providers: [...useCases, CatRepository],
  exports: [...useCases],
  controllers: [CatController],
})
export class CatModule {}
