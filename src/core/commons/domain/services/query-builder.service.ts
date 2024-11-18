import { BaseEntity, Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import {
  ENUM_FILTERS,
  ENUM_LOGICAL_OPERATORS,
} from '../enums/api-filters.enum';
import { ApiFilterQuery, ApiRelationFilter, ISort } from '../types/filter.type';

const LOGIC_OPERATORS = Object.values(ENUM_LOGICAL_OPERATORS);

export class QueryBuilderDirector<T extends BaseEntity> {
  constructor(
    private readonly queryBuilder: QueryBuilder<T>,
    private readonly alias: string,
  ) {}

  private getTypeOrmCondition({
    alias,
    filter,
    property,
    propertyAlias,
    value,
  }: {
    alias: string;
    filter: ENUM_FILTERS;
    property: string;
    propertyAlias: string;
    value: any;
  }): [string, object] {
    switch (filter.replace('[', '').replace(']', '')) {
      case ENUM_FILTERS.EQUAL:
        return [
          `${alias}.${property} = :${propertyAlias}`,
          { [`${propertyAlias}`]: value },
        ];
      case ENUM_FILTERS.NOT_EQUAL:
        return [
          `${alias}.${property} != :${propertyAlias}`,
          { [`${propertyAlias}`]: value },
        ];
      case ENUM_FILTERS.LESS_THAN:
        return [
          `${alias}.${property} < :${propertyAlias}`,
          { [`${propertyAlias}`]: value },
        ];
      case ENUM_FILTERS.LESS_THAN_OR_EQUAL:
        return [
          `${alias}.${property} <= :${propertyAlias}`,
          { [`${propertyAlias}`]: value },
        ];
      case ENUM_FILTERS.GREATER_THAN:
        return [
          `${alias}.${property} > :${propertyAlias}`,
          { [`${propertyAlias}`]: value },
        ];
      case ENUM_FILTERS.GREATER_THAN_OR_EQUAL:
        return [
          `${alias}.${property} >= :${propertyAlias}`,
          { [`${propertyAlias}`]: value },
        ];
      default:
        throw new Error('Invalid filter');
    }
  }

  makeQueryFromQueryFilters(filters: ApiFilterQuery, alias?: string) {
    Object.entries(filters).forEach(([key, value]) => {
      if (!LOGIC_OPERATORS.includes(key as ENUM_LOGICAL_OPERATORS)) {
        const [filter, filterValue] = Object.entries(value)[0];
        return this.addSimpleFilter(
          filter as ENUM_FILTERS,
          key,
          filterValue,
          alias ?? this.alias,
        );
      }

      const bracket = this.generateLogicalBracket(
        key,
        value,
        alias ?? this.alias,
      );
      this.queryBuilder.addBracket(bracket, key as ENUM_LOGICAL_OPERATORS);
    });
  }

  addPagination(skip: number, take: number) {
    this.queryBuilder.addPagination(skip, take);
  }

  addSort(sort: ISort) {
    this.queryBuilder.addSort(sort);
  }

  loadRelations(relations: ApiRelationFilter, parent?: string) {
    Object.entries(relations).forEach(([relation, subRelations]) => {
      if (relation === '0') return; // the end of relation nested

      if (relation === 'filters') {
        return this.makeQueryFromQueryFilters(
          subRelations as ApiFilterQuery,
          parent,
        );
      }

      this.queryBuilder.loadRelation(relation, parent);
      this.loadRelations(subRelations as ApiRelationFilter, relation);
    });
  }

  private generateLogicalBracket(
    operator: any,
    operations: any,
    alias: string,
  ) {
    return new Brackets((qb) => {
      const entries = operations.map(
        (operation: any) => Object.entries(operation)[0],
      );

      const simpleOperations = entries.filter(
        (entry: any) => !LOGIC_OPERATORS.includes(entry[0]),
      );
      const complexOperations = entries.filter((entry: any) =>
        LOGIC_OPERATORS.includes(entry[0]),
      );

      simpleOperations.forEach(([property, filters]: any, i: number) => {
        const [filter, value] = Object.entries(filters)[0];
        const [stmt, params] = this.getTypeOrmCondition({
          alias,
          filter: filter as ENUM_FILTERS,
          property,
          propertyAlias: `${property}_${i}`,
          value,
        });

        if (i == 0) qb.where(stmt, params);
        else
          switch (operator) {
            case ENUM_LOGICAL_OPERATORS.AND:
              qb.andWhere(stmt, params);
              break;
            case ENUM_LOGICAL_OPERATORS.OR:
              qb.orWhere(stmt, params);
              break;
            default:
              break;
          }
      });

      complexOperations.forEach(([logicOperator, operations]: any) => {
        switch (operator) {
          case ENUM_LOGICAL_OPERATORS.AND:
            qb.andWhere(
              this.generateLogicalBracket(logicOperator, operations, alias),
            );
            break;
          case ENUM_LOGICAL_OPERATORS.OR:
            qb.orWhere(
              this.generateLogicalBracket(logicOperator, operations, alias),
            );
            break;
          default:
            break;
        }
      });
    });
  }

  private addSimpleFilter(
    filter: ENUM_FILTERS,
    property: string,
    value: any,
    alias: string,
  ) {
    const [stmt, params] = this.getTypeOrmCondition({
      alias,
      filter: filter as ENUM_FILTERS,
      property,
      propertyAlias: property,
      value,
    });
    this.queryBuilder.where(stmt, params);
  }
}

export class QueryBuilder<T extends BaseEntity> {
  private query: SelectQueryBuilder<T>;
  private firstWhere = true;

  constructor(
    private readonly repository: Repository<T>,
    private readonly alias: string,
  ) {
    this.query = this.repository.createQueryBuilder(this.alias);
  }

  reset() {
    this.query = this.repository.createQueryBuilder(this.alias);
  }

  where(stmt: string, params: object) {
    if (this.firstWhere) {
      this.query.where(stmt, params);
      this.firstWhere = false;
    } else {
      this.query.andWhere(stmt, params);
    }
  }

  andWhere(stmt: string, params: object) {
    this.query.andWhere(stmt, params);
  }

  orWhere(stmt: string, params: object) {
    this.query.orWhere(stmt, params);
  }

  addBracket(bracket: Brackets, operator: ENUM_LOGICAL_OPERATORS) {
    this.firstWhere = false;
    if (operator === ENUM_LOGICAL_OPERATORS.AND) this.query.andWhere(bracket);
    else this.query.orWhere(bracket);
  }

  addPagination(skip: number, take: number) {
    this.query.skip(skip).take(take);
  }

  addSort(sort: ISort) {
    Object.entries(sort).forEach(([field, order]) => {
      this.query.orderBy(`${this.alias}.${field}`, order);
    });
  }

  loadRelation(table: any, parent?: any) {
    if (!parent) this.query.leftJoinAndSelect(`${this.alias}.${table}`, table);
    else this.query.leftJoinAndSelect(`${parent}.${table}`, table);
  }

  debugQuery() {
    return this.query.getQuery();
  }

  async execute() {
    return await this.query.getMany();
  }

  async count() {
    return await this.query.getCount();
  }
}
