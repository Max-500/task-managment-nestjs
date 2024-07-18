import { User } from '../entities/user.entity';

export interface IUserRepository {
  save(user: User): Promise<User | any>;
  login(email: string, password: string): Promise<User | any>;
  findByEmail(email: string): Promise<User | null>;
}