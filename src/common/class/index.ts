import { Expose } from 'class-transformer';

export class BaseResponse<T = any> {
  @Expose()
  statusCode: number;

  @Expose()
  message: string;

  @Expose()
  error?: any;

  @Expose()
  data?: T;
}
