import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}
interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new TransformInterceptor(dto));
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private dto) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((payload: any) => {
        return plainToInstance(
          this.dto,
          {
            statusCode: payload?.statusCode,
            error: payload?.error?.message,
            data: payload?.data,
          },
          {
            excludeExtraneousValues: true,
          },
        );
      }),
    );
  }
}
