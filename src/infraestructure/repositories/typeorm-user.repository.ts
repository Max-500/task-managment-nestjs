import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { LoggingService } from 'src/application/services/logging.service';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly loggingService: LoggingService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async save(user: User): Promise<User> {
    const savedUser = await this.userRepository.save(user);
    await this.loggingService.logAction('CREATE', 'User', savedUser.userId, savedUser.userId, JSON.stringify(user));
    return savedUser;
  }

  async login(email: string, password: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, password } });
  }
}