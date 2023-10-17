import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: ['/Users/ronnachate/git/inventory-api-nestjs/src/**/entities/*.entity{.ts,.js}'],
  migrations: ['/Users/ronnachate/git/inventory-api-nestjs/migrations/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false,
};

export default typeOrmConfig;
