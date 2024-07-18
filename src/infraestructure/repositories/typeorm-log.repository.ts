import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../../domain/entities/log.entity';
import { ILogRepository } from '../../domain/repositories/log.repository';

@Injectable()
export class TypeOrmLogRepository implements ILogRepository {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async createLog(log: Log): Promise<Log> {
    return this.logRepository.save(log);
  }
}
