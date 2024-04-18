import { Module } from '@nestjs/common';
import { DotEnvService } from './environment.service';

@Module({
  imports: [],
  providers: [DotEnvService],
  exports: [DotEnvService],
})
export class DotEnvModule {}
