import { Injectable, PipeTransform } from '@nestjs/common';
import * as qs from 'qs';

@Injectable()
export class QueryParserPipe implements PipeTransform {
  transform(query: any) {
    return qs.parse(qs.stringify(query), {
      depth: 1000,
      parameterLimit: 1000,
    });
  }
}
