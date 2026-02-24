import { Provider, Scope } from '@nestjs/common';
import { DatabaseProvidersEvents } from './database.providers.events';
import config from './../../domain/resources/env.config';
import { Sequelize } from 'sequelize-typescript';
import { ConfigType } from '@nestjs/config';
import * as oracledb from 'oracledb';

/**
 * Servicios que proveen acceso a DB mediante pool de conexiones
 * @autor Germán Alejandro Casallas Guarnizo, Cristian Buelvas
 * 10/01/2024
 */
export const databaseProviders: Provider[] = [
    DatabaseProvidersEvents,
    {
        provide: 'ORACLE_DB_POOL_BSCS',
        useFactory: async (databaseProvidersEvents: DatabaseProvidersEvents, configService: ConfigType<typeof config>): Promise<Sequelize> => {
            oracledb.initOracleClient();
            const sequelize = new Sequelize({
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
                    }
                }
            });
            return sequelize;
        },
        inject: [DatabaseProvidersEvents, config.KEY],
        scope: Scope.DEFAULT
    }  
];