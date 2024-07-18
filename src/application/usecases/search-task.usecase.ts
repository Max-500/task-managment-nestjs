import { Injectable, Inject } from '@nestjs/common';
import { ITaskRepository } from 'src/domain/repositories/task.repository';
import { Task } from 'src/domain/entities/task.entity';
import { SearchTasksDto } from 'src/infraestructure/dtos/search-tasks.dto';

@Injectable()
export class SearchTasksUseCase {
  constructor(@Inject('ITaskRepository') private readonly taskRepository: ITaskRepository) {}

  async run(searchTasksDto: SearchTasksDto, userId: string): Promise<Task[]> {
    return await this.taskRepository.searchTasks(searchTasksDto, userId);
  }
}
