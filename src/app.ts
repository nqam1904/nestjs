import { LoggerMiddleware, RedisCacheModule, TaskModule } from '@common';
import { config } from '@configs';
import { AuthModule, HealthModule, UsersModule } from '@modules';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
@Module({
  imports: [
    // CRONJOB
    ScheduleModule.forRoot(),
    TaskModule,
    // PUBLIC STATIC FILE
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/',
    }),
    // TYPEORM + CONNECT DATABASE
    TypeOrmModule.forRoot(config),
    ThrottlerModule.forRoot([
      // ttl: milisecond, limit: times
      { name: 'long', ttl: 6000, limit: 3 },
      { name: 'short', ttl: 10, limit: 3 },
    ]),
    // MODULE API
    RedisCacheModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
