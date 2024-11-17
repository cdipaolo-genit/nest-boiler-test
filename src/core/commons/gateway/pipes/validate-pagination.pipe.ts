import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatePaginationPipe implements PipeTransform {
  transform(query: any, metadata: ArgumentMetadata) {
    if (!query) return {};

    console.log('Validate pagination:', query);

    if (!query.page || !query.pageSize) return {};

    if (
      [String(Number(query.page)), String(Number(query.pageSize))].includes(
        'NaN',
      )
    )
      throw new Error('The pagination parameters whould be numbers');

    return {
      skip: (Number(query.page) - 1) * Number(query.pageSize),
      take: Number(query.pageSize),
    };
  }
}
