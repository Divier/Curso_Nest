import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AppLoggerService } from './../../domain/config/logger.service';
import { CronJobsEnum } from './cron-jobs.enum';
import { ConnectionRef } from './domain/dto/connection-ref.interface';
import { ORACLE_POOL_STATISTICS } from './../../domain/resources/constants'
/**
 * Servicio que controla el ciclo de vida de los proveedores de DB
 * @autor Germán Alejandro Casallas Guarnizo
 * 10/01/2024
 */
@Injectable()
export class DatabaseProvidersEvents implements OnApplicationShutdown {
    private dataBaseProviders: ConnectionRef[] = [];
    private lastActivityPoolDate: number = Date.now();
    private logStatisticsJob: CronJob;

    constructor(
        private appLoggerService: AppLoggerService,
        private schedulerRegistry: SchedulerRegistry,
    ) {
    }

    public reportPoolActivity() {
        this.lastActivityPoolDate = Date.now();

        if (this.schedulerRegistry.doesExist('cron', CronJobsEnum.LOG_DB_POOL_STATISTICS)) {
            this.logStatisticsJob = this.schedulerRegistry.getCronJob(CronJobsEnum.LOG_DB_POOL_STATISTICS);
    
            if (!this.logStatisticsJob.isActive) {
                this.logStatisticsJob.start();
            }
        }
    }

    @Cron(`*/${parseInt(ORACLE_POOL_STATISTICS.DB_POOL_STATISTICS_TIME_INTERVAL) / 1000} * * * * *`, {
        name: CronJobsEnum.LOG_DB_POOL_STATISTICS,
        disabled: parseInt(ORACLE_POOL_STATISTICS.DB_POOL_ENABLE_STATISTICS) == 0
    })
    logStatistics() {
        if (
            parseInt(ORACLE_POOL_STATISTICS.DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY) == 1 &&
            (Date.now() - this.lastActivityPoolDate) >= parseInt(ORACLE_POOL_STATISTICS.DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY_TIME)
        ) {
            this.schedulerRegistry.getCronJob(CronJobsEnum.LOG_DB_POOL_STATISTICS).stop();
            return;
        }

        if (this.appLoggerService) {
            this.dataBaseProviders.forEach((dataBaseProviderItem) => {
                this.appLoggerService.debug(
                    `Estadísticas para pool alias '${dataBaseProviderItem.alias}' -> ${JSON.stringify(dataBaseProviderItem.getStatistics())}`,
                    '',
                    this.logStatistics.name,
                    ''
                );
                
            });
        }
    }

    publishDataBaseProvider(oracleDbPool: ConnectionRef) {
        this.dataBaseProviders.push(oracleDbPool);
    }

    /**
     * cierra todas las conexiones cuando se termina la aplicación
     * @param signal 
     */
    async onApplicationShutdown(signal: string) {
        const promises: Promise<void>[] = [];
        this.dataBaseProviders.forEach(dataBaseProviderItem => {
            promises.push((async () => {
                try {
                    await dataBaseProviderItem.close();
                } catch (error) {
                    this.appLoggerService.debug(
                        `[Error closing pool '${dataBaseProviderItem.alias}']`,
                        error
                    );
                }
            })());
        });

        await Promise.all(promises);
    }
}