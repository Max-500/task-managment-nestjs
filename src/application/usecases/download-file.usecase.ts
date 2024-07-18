import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from 'src/domain/repositories/task.repository';
import { join } from 'path';

@Injectable()
export class DownloadFileUseCase {
  constructor(@Inject('ITaskRepository') private readonly taskRepository: ITaskRepository) {}

  async run(uuid: string, userId: string): Promise<string> {
    const task = await this.taskRepository.getTask(uuid, userId);
    if (!task || !task.file) {
      throw new NotFoundException('File not found');
    }
    return join(process.cwd(), 'uploads', task.file);
  }
}