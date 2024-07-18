import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Task } from 'src/domain/entities/task.entity';
import { Log } from 'src/domain/entities/log.entity';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_managment',
  entities: [User, Task, Log],
  synchronize: true,
};