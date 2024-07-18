import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from 'src/domain/repositories/task.repository';
import { unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';

const unlinkAsync = promisify(unlink);

@Injectable()
export class DeleteTaskUseCase {
  constructor(@Inject('ITaskRepository') private readonly taskRepository: ITaskRepository) {}

  async run(uuid: string, userId: string): Promise<void> {
    const task = await this.taskRepository.getTask(uuid, userId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.file) {
      const filePath = join(__dirname, '../../../uploads', task.file);
      try {
        await unlinkAsync(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    await this.taskRepository.deleteTask(uuid, userId);
  }
}
