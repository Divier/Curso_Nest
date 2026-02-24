import { OnApplicationShutdown } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppLoggerService } from './../../domain/config/logger.service';
import { ConnectionRef } from './domain/dto/connection-ref.interface';
export declare class DatabaseProvidersEvents implements OnApplicationShutdown {
    private appLoggerService;
    private schedulerRegistry;
    private dataBaseProviders;
    private lastActivityPoolDate;
    private logStatisticsJob;
    constructor(appLoggerService: AppLoggerService, schedulerRegistry: SchedulerRegistry);
    reportPoolActivity(): void;
    logStatistics(): void;
    publishDataBaseProvider(oracleDbPool: ConnectionRef): void;
    onApplicationShutdown(signal: string): Promise<void>;
}
