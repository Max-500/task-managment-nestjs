import { Injectable, Inject } from '@nestjs/common';
import { ILogRepository } from 'src/domain/repositories/log.repository';
import { Log } from 'src/domain/entities/log.entity';

@Injectable()
export class LoggingService {
  constructor(@Inject('ILogRepository') private readonly logRepository: ILogRepository) {}

  async logAction(action: string, entity: string, entityId: string, userId: string, changes?: string): Promise<void> {
    const log = new Log();
    log.action = action;
    log.entity = entity;
    log.entityId = entityId;
    log.userId = userId;
    log.changes = changes;

    await this.logRepository.createLog(log);
  }
}