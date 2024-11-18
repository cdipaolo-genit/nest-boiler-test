import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatePopulationPipe implements PipeTransform {
  transform(query: any) {
    if (!query) return query;

    console.log('Validate populate:', query);

    return query;
  }
}
