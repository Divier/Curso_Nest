"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const common_1 = require("@nestjs/common");
const database_providers_events_1 = require("./database.providers.events");
const env_config_1 = require("./../../domain/resources/env.config");
const sequelize_typescript_1 = require("sequelize-typescript");
const oracledb = require("oracledb");
exports.databaseProviders = [
    database_providers_events_1.DatabaseProvidersEvents,
    {
        provide: 'ORACLE_DB_POOL_BSCS',
        useFactory: async (databaseProvidersEvents, configService) => {
            oracledb.initOracleClient();
            const sequelize = new sequelize_typescript_1.Sequelize({
                dialect: 'oracle',
                dialectOptions: {
                    connectString: configService.ORACLE.LEGACY_DB_CONNECT_STRING,
                },
                logging: false,
                username: configService.ORACLE.LEGACY_DB_VAR1,
                password: configService.ORACLE.LEGACY_DB_VAR2,
                pool: {
                    max: parseInt(configService.ORACLE.LEGACY_DB_POOL_MAX),
                    min: parseInt(configService.ORACLE.LEGACY_DB_POOL_MIN),
                    acquire: 20000,
                    idle: 10000,
                    evict: 15000,
                },
                hooks: {
                    beforePoolAcquire: () => {
                        databaseProvidersEvents.reportPoolActivity();
                    }
                }
            });
            setInterval(async () => {
                await sequelize.query('SELECT 1 FROM DUAL');
            }, 5 * 60 * 1000);
            await sequelize.authenticate();
            databaseProvidersEvents.publishDataBaseProvider({
                alias: configService.ORACLE.LEGACY_DB_ALIAS,
                close: () => sequelize.close(),
                getStatistics: () => {
                    return {
                        count: sequelize.connectionManager['pool']._count,
                    };
                }
            });
            return sequelize;
        },
        inject: [database_providers_events_1.DatabaseProvidersEvents, env_config_1.default.KEY],
        scope: common_1.Scope.DEFAULT
    }
];
//# sourceMappingURL=database.providers.js.map