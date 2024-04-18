import { IsNotEmpty, IsString } from 'class-validator';

export class HealthCheckServiceDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
