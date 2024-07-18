import { Transform } from 'class-transformer';
import { IsString, IsEnum, IsDateString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { TaskStatus } from 'src/domain/enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(',').map(tag => tag.trim()))
  tags?: string[];

  @IsOptional()
  @IsString()
  file?: string;
}