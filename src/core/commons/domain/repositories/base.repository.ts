import { Injectable } from '@nestjs/common';
import {
  BaseEntity,
  DataSource,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import {
  QueryBuilder,
  QueryBuilderDirector,
} from '../services/query-builder.service';
import {
  ApiFilterQuery,
  ApiRelationFilter,
  IPagination,
  ISort,
} from '../types/filter.type';

@Injectable()
export class BaseRepository<T extends BaseEntity> {
  protected repository: Repository<T>;
  protected alias = '';

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
    this.alias = dataSource.getMetadata(entity).name;
  }

  async findOne(filters: FindOptionsWhere<T>) {
    return await this.repository.findOne({ where: filters });
  }

  async find({
    filters,
    pagination,
    relations,
    sort,
  }: {
    filters?: ApiFilterQuery;
    pagination?: IPagination;
    relations?: ApiRelationFilter;
    sort?: ISort;
  }) {
    const qb = new QueryBuilder(this.repository, this.alias);
    const director = new QueryBuilderDirector(qb, this.alias);

    if (relations && Object.keys(relations).length > 0)
      director.loadRelations(relations);
    if (filters && Object.keys(filters).length > 0)
      director.makeQueryFromQueryFilters(filters);
    if (pagination && Object.keys(pagination).length > 0)
      director.addPagination(pagination.skip, pagination.take);
    if (sort && Object.keys(sort).length > 0) director.addSort(sort);

    const res = await qb.execute();
    const count = await qb.count();

    return [res, count] as any;
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
