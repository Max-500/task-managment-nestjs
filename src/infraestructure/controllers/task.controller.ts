import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, UploadedFile, UseInterceptors, Get, Query, Param, NotFoundException, Res, Delete, Put } from '@nestjs/common';
import { CreateTaskUseCase } from 'src/application/usecases/create-task.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/domain/entities/user.entity';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { ResponseDto } from '../dtos/responses.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { plainToClass } from 'class-transformer';
import { TaskResponseDto } from '../dtos/task-response.dto';
import { GetTasksUseCase } from 'src/application/usecases/get-tasks.usecase';
import { GetTaskUseCase } from 'src/application/usecases/get-task.usecase';
import { DeleteTaskUseCase } from 'src/application/usecases/delete-task.usecase';
import { UpdateTaskUseCase } from 'src/application/usecases/update-task.usecase';
import { DownloadFileUseCase } from 'src/application/usecases/download-file.usecase';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { Response } from 'express';
import { SearchTasksDto } from '../dtos/search-tasks.dto';
import { SearchTasksUseCase } from 'src/application/usecases/search-task.usecase';
import { LoggingService } from 'src/application/services/logging.service';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly downloadFileUseCase: DownloadFileUseCase,
    private readonly searchTasksUseCase: SearchTasksUseCase,
    private readonly loggingService: LoggingService
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      const allowedFileTypes = ['.pdf', '.png', '.jpg', '.jpeg'];
      const ext = extname(file.originalname).toLowerCase();
      if (allowedFileTypes.includes(ext)) {
        callback(null, true);
      } else {
        callback(new Error('File type not allowed'), false);
      }
    },
  }))
  async createTask(@Body() createTaskDto: CreateTaskDto, @UploadedFile() file: Express.Multer.File, @GetUser() user: User): Promise<ResponseDto> {
    if (file) {
      createTaskDto.file = file.filename;
    }
    const task = await this.createTaskUseCase.run(createTaskDto, user);
    const taskResponse = plainToClass(TaskResponseDto, task);

    return new ResponseDto('Task created successfully', taskResponse);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTasks(@Query('page') page: number, @Query('limit') limit: number, @GetUser() user: User): Promise<ResponseDto> {
    const { tasks, total } = await this.getTasksUseCase.run(page, limit, user.userId);
    const tasksResponse = tasks.map(task => plainToClass(TaskResponseDto, task));

    await this.loggingService.logAction('READ_ALL', 'Task', 'all', user.userId);
    return new ResponseDto('Tasks retrieved successfully', { tasks: tasksResponse, total });
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  async getTask(@Param('uuid') uuid: string, @GetUser() user: User): Promise<ResponseDto> {
    const task = await this.getTaskUseCase.run(uuid, user.userId);
    const taskResponse = plainToClass(TaskResponseDto, task);

    await this.loggingService.logAction('READ', 'Task', uuid, user.userId);
    return new ResponseDto('Task retrieved successfully', taskResponse);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Param('uuid') uuid: string, @GetUser() user: User): Promise<ResponseDto> {
    await this.deleteTaskUseCase.run(uuid, user.userId);
    await this.loggingService.logAction('DELETE', 'Task', uuid, user.userId);
    return new ResponseDto('Task deleted successfully', null);
  }

  @Get('download/:uuid')
  @UseGuards(JwtAuthGuard)
  async downloadFile(@Param('uuid') uuid: string, @Res() res: Response, @GetUser() user: User): Promise<void> {
    try {
      const filePath = await this.downloadFileUseCase.run(uuid, user.userId);
      await this.loggingService.logAction('DOWNLOAD', 'Task', uuid, user.userId);
      res.download(filePath);
    } catch (error) {
      await this.loggingService.logAction('ERROR', 'Task', uuid, user.userId, JSON.stringify(error));
      throw new NotFoundException('File not found');
    }
  }

  @Put(':uuid')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      const allowedFileTypes = ['.pdf', '.png', '.jpg', '.jpeg'];
      const ext = extname(file.originalname).toLowerCase();
      if (allowedFileTypes.includes(ext)) {
        callback(null, true);
      } else {
        callback(new Error('File type not allowed'), false);
      }
    },
  }))
  async updateTask(
    @Param('uuid') uuid: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<ResponseDto> {
    if (file) {
      updateTaskDto.file = file.filename;
    }
    const updatedTask = await this.updateTaskUseCase.run(uuid, updateTaskDto, user.userId);
    const taskResponse = plainToClass(TaskResponseDto, updatedTask);
    return new ResponseDto('Task updated successfully', taskResponse);
  }

  @Post('search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchTasks(@Body() searchTasksDto: SearchTasksDto, @GetUser() user: User): Promise<ResponseDto> {
    const tasks = await this.searchTasksUseCase.run(searchTasksDto, user.userId);
    const tasksResponse = tasks.map(task => plainToClass(TaskResponseDto, task));

    await this.loggingService.logAction('SEARCH', 'Task', 'all', user.userId, JSON.stringify(searchTasksDto));
    return new ResponseDto('Tasks found successfully', tasksResponse);
  }
}
