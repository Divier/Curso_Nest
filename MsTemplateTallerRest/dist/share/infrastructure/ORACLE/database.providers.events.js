"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProvidersEvents = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const logger_service_1 = require("./../../domain/config/logger.service");
const cron_jobs_enum_1 = require("./cron-jobs.enum");
const constants_1 = require("./../../domain/resources/constants");
let DatabaseProvidersEvents = class DatabaseProvidersEvents {
    constructor(appLoggerService, schedulerRegistry) {
        this.appLoggerService = appLoggerService;
        this.schedulerRegistry = schedulerRegistry;
        this.dataBaseProviders = [];
        this.lastActivityPoolDate = Date.now();
    }
    reportPoolActivity() {
        this.lastActivityPoolDate = Date.now();
        if (this.schedulerRegistry.doesExist('cron', cron_jobs_enum_1.CronJobsEnum.LOG_DB_POOL_STATISTICS)) {
            this.logStatisticsJob = this.schedulerRegistry.getCronJob(cron_jobs_enum_1.CronJobsEnum.LOG_DB_POOL_STATISTICS);
            if (!this.logStatisticsJob.isActive) {
                this.logStatisticsJob.start();
            }
        }
    }
    logStatistics() {
        if (parseInt(constants_1.ORACLE_POOL_STATISTICS.DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY) == 1 &&
            (Date.now() - this.lastActivityPoolDate) >= parseInt(constants_1.ORACLE_POOL_STATISTICS.DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY_TIME)) {
            this.schedulerRegistry.getCronJob(cron_jobs_enum_1.CronJobsEnum.LOG_DB_POOL_STATISTICS).stop();
            return;
        }
        if (this.appLoggerService) {
            this.dataBaseProviders.forEach((dataBaseProviderItem) => {
                this.appLoggerService.debug(`Estadísticas para pool alias '${dataBaseProviderItem.alias}' -> ${JSON.stringify(dataBaseProviderItem.getStatistics())}`, '', this.logStatistics.name, '');
            });
        }
    }
    publishDataBaseProvider(oracleDbPool) {
        this.dataBaseProviders.push(oracleDbPool);
    }
    async onApplicationShutdown(signal) {
        const promises = [];
        this.dataBaseProviders.forEach(dataBaseProviderItem => {
            promises.push((async () => {
                try {
                    await dataBaseProviderItem.close();
                }
                catch (error) {
                    this.appLoggerService.debug(`[Error closing pool '${dataBaseProviderItem.alias}']`, error);
                }
            })());
        });
        await Promise.all(promises);
    }
};
exports.DatabaseProvidersEvents = DatabaseProvidersEvents;
__decorate([
    (0, schedule_1.Cron)(`*/${parseInt(constants_1.ORACLE_POOL_STATISTICS.DB_POOL_STATISTICS_TIME_INTERVAL) / 1000} * * * * *`, {
        name: cron_jobs_enum_1.CronJobsEnum.LOG_DB_POOL_STATISTICS,
        disabled: parseInt(constants_1.ORACLE_POOL_STATISTICS.DB_POOL_ENABLE_STATISTICS) == 0
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DatabaseProvidersEvents.prototype, "logStatistics", null);
exports.DatabaseProvidersEvents = DatabaseProvidersEvents = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService,
        schedule_1.SchedulerRegistry])
], DatabaseProvidersEvents);
//# sourceMappingURL=database.providers.events.js.map