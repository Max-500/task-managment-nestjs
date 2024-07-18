import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Task } from 'src/domain/entities/task.entity';
import { ITaskRepository } from 'src/domain/repositories/task.repository';

@Injectable()
export class GetTaskUseCase {
  constructor(@Inject('ITaskRepository') private readonly taskRepository: ITaskRepository) {}

  async run(uuid: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.getTask(uuid, userId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}