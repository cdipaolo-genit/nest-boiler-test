import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ENUM_FILTERS } from 'src/domain/enum/api-filters.enum';
import {
  Equal,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

const ALLOWED_FILTERS = Object.values(ENUM_FILTERS);

@Injectable()
export class ValidateFiltersPipe implements PipeTransform {
  transform(query: any, metadata: ArgumentMetadata) {
    if (!query) return query;

    console.log('Validate filters:', query);

    const typeOrmFilterObject: { [key: string]: any } = {};

    for (const property in query) {
      const filtersForProperty = Object.keys(query[property]);

      if (
        filtersForProperty.some(
          (filter: ENUM_FILTERS) => !ALLOWED_FILTERS.includes(filter),
        )
      )
        throw new Error(
          `filter ${filtersForProperty.find((filter: ENUM_FILTERS) => !ALLOWED_FILTERS.includes(filter))} not allowed`,
        );

      Object.entries(query[property]).forEach(([filter, value]) => {
        switch (filter) {
          case ENUM_FILTERS.EQUAL:
            typeOrmFilterObject[property] = Equal(value);
            break;
          case ENUM_FILTERS.NOT_EQUAL:
            typeOrmFilterObject[property] = Not(Equal(value));
            break;
          case ENUM_FILTERS.LESS_THAN:
            typeOrmFilterObject[property] = LessThan(value);
            break;
          case ENUM_FILTERS.LESS_THAN_OR_EQUAL:
            typeOrmFilterObject[property] = LessThanOrEqual(value);
            break;
          case ENUM_FILTERS.GREATER_THAN:
            typeOrmFilterObject[property] = MoreThan(value);
            break;
          case ENUM_FILTERS.GREATER_THAN_OR_EQUAL:
            typeOrmFilterObject[property] = MoreThanOrEqual(value);
            break;
          case ENUM_FILTERS.IS_NULL:
            typeOrmFilterObject[property] = IsNull();
            break;
          case ENUM_FILTERS.IS_NOT_NULL:
            typeOrmFilterObject[property] = Not(IsNull());
            break;
          default:
            break;
        }
      });
    }

    return { ...typeOrmFilterObject };
  }
}
