import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req = context.switchToHttp().getRequest();

    console.log(req);

    return next.handle().pipe(
      map((data) => {
        const pagination = req.pagination;
        if (!(pagination?.skip + 1) || !pagination.take)
          return { data, pagination };

        const page = pagination.skip / pagination.take + 1;
        const pageSize = pagination.take;
        const lastPage = Math.ceil(pagination.total / pageSize);
        const next = page * pageSize > pagination.total ? null : page + 1;
        let prev = page - 1 < 1 ? null : page - 1;
        prev = prev && prev >= lastPage ? lastPage : prev;

        return {
          data,
          meta: {
            page,
            pageSize,
            total: pagination.total,
            next,
            prev,
          },
        };
      }),
    );
  }
}
