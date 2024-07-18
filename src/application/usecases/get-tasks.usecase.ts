import { Injectable, Inject } from '@nestjs/common';
import { ITaskRepository } from 'src/domain/repositories/task.repository';

@Injectable()
export class GetTasksUseCase {
  constructor(@Inject('ITaskRepository') private readonly taskRepository: ITaskRepository) {}

  async run(page: number, limit: number, userId: string) {
    return this.taskRepository.getAllTasks(page, limit, userId);
  }
}
