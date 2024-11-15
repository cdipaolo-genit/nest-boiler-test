import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateSortPipe implements PipeTransform {
  transform(query: any, metadata: ArgumentMetadata) {
    if (!query) return query;

    console.log('Validate sort:', query);

    for (const property in query) {
      if (!['asc', 'desc'].includes(query[property]))
        throw new Error(`The value ${query[property]} must be 'asc' or 'desc'`);

      query[property] = query[property].toUpperCase();
    }

    return { ...query };
  }
}
