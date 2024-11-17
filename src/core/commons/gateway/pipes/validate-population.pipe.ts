import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatePopulationPipe implements PipeTransform {
  transform(query: any) {
    if (!query) return query;

    console.log('Validate populate:', query);

    const relations: { [key: string]: boolean } = {};

    query.split(',').forEach((name: string) => {
      relations[name] = true;
    });

    return relations;
  }
}
