import { Injectable } from '@nestjs/common';
import {
  BaseEntity,
  DataSource,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export interface IPagination {
  skip: number;
  take: number;
}

@Injectable()
export class BaseRepository<T extends BaseEntity> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  async findOne(filters: FindOptionsWhere<T>) {
    return await this.repository.findOne({ where: filters });
  }

  async find(
    filters: FindOptionsWhere<T>,
    pagination?: IPagination,
    sort?: FindOptionsOrder<T>,
  ) {
    const paginationParams = pagination ? pagination : {};
    return await this.repository.findAndCount({
      where: filters,
      ...paginationParams,
      order: sort,
    });
  }

  async create(doc: T) {
    return await this.repository.save(doc);
  }

  async update(id: number, doc: Partial<ObjectLiteral>) {
    await this.repository.update(id, doc);
    const filters: FindOptionsWhere<ObjectLiteral> = { id };

    return await this.repository.findOneBy(filters);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
