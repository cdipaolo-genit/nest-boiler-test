import {
  ENUM_FILTERS,
  ENUM_LOGICAL_OPERATORS,
} from '../enums/api-filters.enum';

type ApiFilterValue = {
  [key: string]: { [key in ENUM_FILTERS]: string | number };
};

type ApiLogicalFilter = {
  [key in ENUM_LOGICAL_OPERATORS]: {
    [key: string]: ApiFilterValue | ApiLogicalFilter;
  }[];
};

export type ApiFilterQuery = ApiFilterValue | ApiLogicalFilter;

export type ApiRelationFilter = {
  [key: string]: { [key: string]: ApiRelationFilter } | ApiFilterQuery;
};

export type IPagination = {
  skip: number;
  take: number;
};

export interface ISort {
  [key: string]: 'ASC' | 'DESC';
}
