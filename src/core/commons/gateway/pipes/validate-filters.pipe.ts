import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateFiltersPipe implements PipeTransform {
  transform(query: any) {
    if (!query) return query;

    console.log('Validate filters:', query);
    return query;
  }
}
