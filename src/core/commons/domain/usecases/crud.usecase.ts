import { BaseUseCase } from './base-use-case.interface';
import { BaseEntity, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from 'src/core/commons/domain/repositories/base.repository';
import {
  ApiFilterQuery,
  ApiRelationFilter,
  ISort,
  IPagination,
} from '../types/filter.type';

export abstract class CreateUseCase<T extends BaseEntity>
  implements BaseUseCase
{
  constructor(private readonly repository: BaseRepository<T>) {}

  async execute(doc: T): Promise<T | null> {
    return await this.repository.create(doc);
  }
}

export abstract class DeleteUseCase<T extends BaseEntity>
  implements BaseUseCase
{
  constructor(private readonly repository: BaseRepository<T>) {}

  async execute(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

export abstract class UpdateUseCase<T extends BaseEntity>
  implements BaseUseCase
{
  constructor(private readonly repository: BaseRepository<T>) {}

  async execute(id: number, doc: T): Promise<T | null> {
    return await this.repository.update(id, doc);
  }
}

export abstract class GetAllUseCase<T extends BaseEntity>
  implements BaseUseCase
{
  constructor(private readonly repository: BaseRepository<T>) {}

  async execute(params: {
    filters: ApiFilterQuery;
    pagination?: IPagination;
    sort?: ISort;
    relations?: ApiRelationFilter;
  }): Promise<[T[], number]> {
    return await this.repository.find(params);
  }
}

export abstract class GetOneUseCase<T extends BaseEntity>
  implements BaseUseCase
{
  constructor(private readonly repository: BaseRepository<T>) {}

  async execute(id: number): Promise<T | null> {
    return await this.repository.findOne({
      id: id,
    } as unknown as FindOptionsWhere<T>);
  }
}
