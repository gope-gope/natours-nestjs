import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    const result$ = next.handle();
    /* === Before logic === */

    return result$.pipe(
      map((data) => {
        /* === After logic === */
        return {
          status: 'success',
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Request successful',
          data,
          dataLength: Array.isArray(data) ? data.length : undefined,
        };
      }),
    );
  }
}
