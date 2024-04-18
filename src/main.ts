import {
  configSwagger,
  HttpExceptionFilter,
  swaggerModule,
  TimeoutInterceptor,
} from '@common';
import { DotEnvService } from '@environment';
import {
  InternalServerErrorException,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app';
const logger = new Logger('APP');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: true,
    });

    // APP
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.setGlobalPrefix('api');

    // Starts listening to shutdown hooks
    app.enableShutdownHooks();

    // interceptors
    app.useGlobalInterceptors(new TimeoutInterceptor());

    app.useGlobalFilters(new HttpExceptionFilter());

    // swagger
    const document = SwaggerModule.createDocument(app, configSwagger, {
      include: swaggerModule,
      ignoreGlobalPrefix: true,
    });

    SwaggerModule.setup('docs', app, document);

    // environment
    const env = new DotEnvService();
    const PORT = env.get('APP_PORT', 5005);
    const NODE_ENV = env.get('NODE_ENV', 'local');

    // Start app
    await app.listen(PORT);

    NODE_ENV === 'local' && logger.log(`🚀 Server run with port: ${PORT}`);
    NODE_ENV === 'local' && logger.log(`🚀 Get config all env: ${NODE_ENV}`);
  } catch (error) {
    logger.error(`🚀 Error starting server, ${error}`, '', 'Bootstrap', false);
    throw new InternalServerErrorException(error);
  }
}
bootstrap();
