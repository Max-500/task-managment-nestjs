import { Injectable, Inject } from '@nestjs/common';
import { Task } from 'src/domain/entities/task.entity';
import { ITaskRepository } from 'src/domain/repositories/task.repository';
import { User } from 'src/domain/entities/user.entity';
import { CreateTaskDto } from 'src/infraestructure/dtos/create-task.dto';

@Injectable()
export class CreateTaskUseCase {
  constructor(@Inject('ITaskRepository') private readonly taskRepository: ITaskRepository) {}

  async run(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.status = createTaskDto.status;
    task.dueDate = createTaskDto.dueDate;
    task.comments = createTaskDto.comments;
    task.tags = createTaskDto.tags;
    task.file = createTaskDto.file;
    task.userUUID = user.userId;

    const savedTask = await this.taskRepository.createTask(task);

    return savedTask;
  }
}