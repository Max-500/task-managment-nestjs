import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { TaskStatus } from 'src/domain/enums/task-status.enum';

export class SearchTasksDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsNumber()
  daysRemaining?: number;

  @IsOptional()
  @IsString()
  fileFormat?: string;
}