import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Expose()
  password: string;
}