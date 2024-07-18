import { Log } from "../entities/log.entity";

export interface ILogRepository {
    createLog(log: Log): Promise<Log | any>;
}