import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { User } from './domain/entities/user.entity';
import { typeOrmConfig } from './infraestructure/config/typeorm.config';
import { UserController } from './infraestructure/controllers/user.controller';
import { TypeOrmUserRepository } from './infraestructure/repositories/typeorm-user.repository';
import { Task } from './domain/entities/task.entity';
import { CreateTaskUseCase } from './application/usecases/create-task.usecase';
import { TaskController } from './infraestructure/controllers/task.controller';
import { TypeOrmTaskRepository } from './infraestructure/repositories/typeorm-task.repository';
import { GetTasksUseCase } from './application/usecases/get-tasks.usecase';
import { GetTaskUseCase } from './application/usecases/get-task.usecase';
import { DownloadFileUseCase } from './application/usecases/download-file.usecase';
import { DeleteTaskUseCase } from './application/usecases/delete-task.usecase';
import { UpdateTaskUseCase } from './application/usecases/update-task.usecase';
import { SearchTasksUseCase } from './application/usecases/search-task.usecase';
import { TypeOrmLogRepository } from './infraestructure/repositories/typeorm-log.repository';
import { Log } from './domain/entities/log.entity';
import { LoggingService } from './application/services/logging.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User, Task, Log]),
    AuthModule,
  ],
  controllers: [UserController, TaskController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    CreateTaskUseCase,
    GetTasksUseCase,
    GetTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    DownloadFileUseCase,
    SearchTasksUseCase,
    LoggingService,
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'ITaskRepository',
      useClass: TypeOrmTaskRepository,
    },
    {
      provide: 'ILogRepository',
      useClass: TypeOrmLogRepository,
    },

  ],
})

export class AppModule {}