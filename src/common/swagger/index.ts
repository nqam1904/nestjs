import { AuthModule } from '@modules';
import { DocumentBuilder } from '@nestjs/swagger';

export const configSwagger = new DocumentBuilder()
  .setTitle('Swagger Api')
  .setVersion('1.0.0')
  .addServer('/api')
  .setDescription('NestJS')
  .setTermsOfService('')
  .setLicense('MIT License', '')
  .setExternalDoc('For more information', 'http://swagger.io')
  .build();

export const swaggerModule = [AuthModule];
