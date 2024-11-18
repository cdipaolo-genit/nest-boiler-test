import { Module } from '@nestjs/common';
import * as CrudCatUseCase from './domain/usecases/crud-cat.usecase';
import * as CrudTagUseCase from './domain/usecases/crud-tag.usecase';

import { CatRepository } from './domain/repositories/cat.repository';
import { CatController } from './gateway/controllers/cat.controller';
import { TagRepository } from './domain/repositories/tag.repository';
import { TagController } from './gateway/controllers/tag.controller';

const useCases = [
  ...Object.values(CrudCatUseCase),
  ...Object.values(CrudTagUseCase),
];
const repositories = [CatRepository, TagRepository];
const controllers = [CatController, TagController];

@Module({
  imports: [],
  providers: [...useCases, ...repositories],
  exports: useCases,
  controllers: controllers,
})
export class CatModule {}
