import { Transform } from 'class-transformer';
import { IsString, IsEnum, IsDateString, IsOptional, IsArray } from 'class-validator';
import { TaskStatus } from 'src/domain/enums/task-status.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

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
