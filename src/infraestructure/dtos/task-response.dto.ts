import { Expose, Transform } from 'class-transformer';

export class TaskResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  dueDate: Date;

  @Expose()
  comments?: string;

  @Expose()
  tags?: string[];

  @Expose()
  file?: string;

  @Expose()
  @Transform(({ obj }) => obj.createdBy?.uuid)
  userUUID: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.createdBy) {
      return {
        userId: obj.createdBy.uuid,
        email: obj.createdBy.email,
      };
    }
    return null;
  })
  createdBy: {
    userId: string;
    email: string;
  };
}