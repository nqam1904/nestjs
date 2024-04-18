import { DotEnvService } from '@environment';
import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { RedisOptions, Transport } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckServiceDto } from './dto/health-check-services.dto';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private memory: MemoryHealthIndicator,
    private env: DotEnvService,
    private readonly database: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  public healtCheckApp(): Promise<any> {
    try {
      return this.health.check([
        // the process should not use more than 300MB memory
        async () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
        // The process should not have more than 300MB RSS memory allocated
        async () => this.memory.checkRSS('memory_RSS', 300 * 1024 * 1024),
        async () =>
          this.microservice.pingCheck<RedisOptions>('redis', {
            transport: Transport.REDIS,
            options: {
              host: this.env.get('REDIS_HOST'),
              port: +this.env.get('REDIS_PORT'),
            },
          }),
        async () => this.database.pingCheck('postgres', { timeout: 1500 }),
      ]);
    } catch (error) {
      return error;
    }
  }

  @Post('check-service')
  @HealthCheck()
  public checkServiceExternal(
    @Body(ValidationPipe) body: HealthCheckServiceDto,
  ): Promise<any> {
    const { url, name } = body;
    return this.health.check([
      async () =>
        this.http.responseCheck(name, url, (res) => res.status === 204),
    ]);
  }
}
