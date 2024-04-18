import { DotEnvModule } from '@environment';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
      gracefulShutdownTimeoutMs: 5000,
    }),
    HttpModule,
    DotEnvModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
