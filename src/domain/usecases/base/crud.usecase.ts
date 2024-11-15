import { BaseUseCase } from '../base-use-case.interface';
import { BaseEntity, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import {
  BaseRepository,
  IPagination,
} from '../../repositories/base.repository';

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

  async execute(
    filters: FindOptionsWhere<T>,
    pagination?: IPagination,
    sort?: FindOptionsOrder<T>,
  ): Promise<[T[], number]> {
    return await this.repository.find(filters, pagination, sort);
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
