import { DotEnvService } from '@environment';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
const env = new DotEnvService();
const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: `${env.get('DATABASE_HOST')}`,
  port: +`${env.get('DATABASE_PORT')}`,
  username: `${env.get('DATABASE_USERNAME')}`,
  password: `${env.get('DATABASE_PASSWORD')}`,
  database: `${env.get('DATABASE_NAME')}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
};

export { config };
