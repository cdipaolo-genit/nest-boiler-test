import { Injectable } from '@nestjs/common';
import {
  GetAllUseCase,
  CreateUseCase,
  GetOneUseCase,
  UpdateUseCase,
  DeleteUseCase,
} from 'src/core/commons/domain/usecases/crud.usecase';
import { Tag } from '../entities/tag.entity';
import { TagRepository } from '../repositories/tag.repository';

@Injectable()
export class CreateTagUseCase extends CreateUseCase<Tag> {
  constructor(repository: TagRepository) {
    super(repository);
  }
}

@Injectable()
export class GetAllTagsUseCase extends GetAllUseCase<Tag> {
  constructor(repository: TagRepository) {
    super(repository);
  }
}

@Injectable()
export class GetOneTagUseCase extends GetOneUseCase<Tag> {
  constructor(repository: TagRepository) {
    super(repository);
  }
}

@Injectable()
export class DeleteTagUseCase extends DeleteUseCase<Tag> {
  constructor(repository: TagRepository) {
    super(repository);
  }
}

@Injectable()
export class UpdateTagUseCase extends UpdateUseCase<Tag> {
  constructor(repository: TagRepository) {
    super(repository);
  }
}
