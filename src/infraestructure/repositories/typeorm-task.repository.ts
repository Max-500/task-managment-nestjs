// src/infrastructure/repositories/typeorm-task.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { SearchTasksDto } from '../dtos/search-tasks.dto';
import { differenceInDays } from 'date-fns';
import { LoggingService } from 'src/application/services/logging.service';

@Injectable()
export class TypeOrmTaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly loggingService: LoggingService,
  ) {}

  async createTask(task: Task): Promise<Task> {
    try {

      const taskToInsert = {
        ...task,
        userUUID: task.userUUID
      };

      const result = await this.taskRepository.insert(taskToInsert);

      const createdTask = await this.taskRepository.findOne({ where: { uuid: result.identifiers[0].uuid }, relations: ['createdBy'] });

      await this.loggingService.logAction('CREATE', 'Task', createdTask.uuid, task.userUUID, JSON.stringify(taskToInsert));
      
      return createdTask;
    } catch (error) {
      await this.loggingService.logAction('ERROR', 'Task', null, task.userUUID, JSON.stringify(error));
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async getTask(uuid: string, userId: string): Promise<Task | null> {
    try {
      const task = await this.taskRepository.findOne({ where: { uuid }, relations: ['createdBy'] });
      await this.loggingService.logAction('READ', 'Task', uuid, userId);
      return task;
    } catch (error) {
      await this.loggingService.logAction('ERROR', 'Task', uuid, userId, JSON.stringify(error));
      throw error;
    }
  }

  async getAllTasks(page: number, limit: number): Promise<{ tasks: Task[], total: number }> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['createdBy'],
    });
    return { tasks, total };
  }

  async editTask(uuid: string, task: Partial<Task>): Promise<Task> {
    try {
      await this.taskRepository.update(uuid, task);
      const updatedTask = await this.getTask(uuid, task.userUUID);
      return updatedTask;
    } catch (error) {
      console.error('Error editing task:', error);
      throw error;
    }
  }

  async deleteTask(uuid: string, userId: string): Promise<void> {
    try {
      await this.taskRepository.delete(uuid);

      await this.loggingService.logAction('DELETE', 'Task', uuid, userId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async searchTasks(searchTasksDto: SearchTasksDto): Promise<Task[]> {
    const { keyword, status, daysRemaining, fileFormat } = searchTasksDto;

    const query = this.taskRepository.createQueryBuilder('task');

    if (keyword) {
      query.andWhere('task.title LIKE :keyword OR task.description LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (typeof daysRemaining === 'number') {
      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + daysRemaining);
      query.andWhere('task.dueDate BETWEEN :today AND :dueDate', { today, dueDate });
    }

    if (fileFormat) {
      query.andWhere('task.file LIKE :fileFormat', { fileFormat: `%.${fileFormat}` });
    }

    const tasks = await query.getMany();

    tasks.forEach(task => {
      task['weight'] = 0;

      if (keyword) {
        const keywordRegex = new RegExp(keyword, 'gi');
        const titleMatches = (task.title.match(keywordRegex) || []).length;
        const descriptionMatches = (task.description.match(keywordRegex) || []).length;
        task['weight'] += titleMatches + descriptionMatches;
      }

      if (status && task.status === status) {
        task['weight'] += 1;
      }

      if (typeof daysRemaining === 'number') {
        const remainingDays = differenceInDays(new Date(task.dueDate), new Date());
        if (remainingDays <= daysRemaining) {
          task['weight'] += 1;
        }
      }

      if (fileFormat && task.file && task.file.endsWith(fileFormat)) {
        task['weight'] += 1;
      }
    });

    tasks.sort((a, b) => b['weight'] - a['weight']);

    return tasks;
  }
}