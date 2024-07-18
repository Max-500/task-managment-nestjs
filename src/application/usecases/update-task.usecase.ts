import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from 'src/domain/repositories/task.repository';
import { unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { UpdateTaskDto } from 'src/infraestructure/dtos/update-task.dto';

const unlinkAsync = promisify(unlink);

@Injectable()
export class UpdateTaskUseCase {
  constructor(@Inject('ITaskRepository') private readonly taskRepository: ITaskRepository) {}

  async run(uuid: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.taskRepository.getTask(uuid, userId);
    if (!task) {
      if (updateTaskDto.file) {
        const newFilePath = join(__dirname, '../../../uploads', updateTaskDto.file);
        try {
          await unlinkAsync(newFilePath);
        } catch (error) {
          console.error('Error deleting new file:', error);
          throw error;
        }
      }
      throw new NotFoundException('Task not found');
    }

    if (updateTaskDto.file && task.file && updateTaskDto.file !== task.file) {
      const oldFilePath = join(__dirname, '../../../uploads', task.file);
      try {
        await unlinkAsync(oldFilePath);
      } catch (error) {
        console.error('Error deleting old file:', error);
        throw error;
      }
    }

    const updatedTask = await this.taskRepository.editTask(uuid, updateTaskDto);
    return updatedTask;
  }
}