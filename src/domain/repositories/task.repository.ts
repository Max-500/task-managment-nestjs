import { SearchTasksDto } from 'src/infraestructure/dtos/search-tasks.dto';
import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  createTask(task: Task): Promise<Task>;
  getTask(uuid: string, userId: string): Promise<Task | null>;
  getAllTasks(page: number, limit: number, userId: string): Promise<{ tasks: Task[], total: number }>;
  editTask(uuid: string, task: Partial<Task>, userId: string): Promise<Task>;
  deleteTask(uuid: string, userId: string): Promise<void>;
  searchTasks(searchTasksDto: SearchTasksDto, userId: string): Promise<Task[]>;
}