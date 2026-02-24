import { Test, TestingModule } from '@nestjs/testing';
import { OracleExampleOracleService } from '../../../src/oracleExample/infraestructure/oracle/oracleExample.oracle.service';
import { ApmService } from './../../../src/share/domain/config/apm.service';
import { AppLoggerService } from '../../../src/share/domain/config/logger.service';
import { ProcessTimeService } from '../../../src/share/domain/config/processTime.service';
import config from '../../../src/share/domain/resources/env.config';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from '../../../src/share/domain/global.module';
import { Sequelize } from 'sequelize';

describe('Database service', () => {
    let databaseService: OracleExampleOracleService;
    let processTime: ProcessTimeService;
    const transactionId = 'test-transaction-id';
    let sequelize: Sequelize;
    beforeEach(async () =>{
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [config],
                    isGlobal: true,
                    }),
                    GlobalModule
                ],
            providers:[
                {
                    provide: 'ORACLE_DB_POOL_BSCS',
                    useValue: {
                        authenticate: jest.fn(),
                        query: jest.fn(),
                    },
                },
                OracleExampleOracleService, 
                ApmService, 
                AppLoggerService, 
                ProcessTimeService,
                { provide: 'TransactionId', useValue: transactionId },
                ]
        }).compile();
        databaseService = moduleRef.get<OracleExampleOracleService>(OracleExampleOracleService);
        processTime = moduleRef.get<ProcessTimeService>(ProcessTimeService);
        sequelize = moduleRef.get<Sequelize>('ORACLE_DB_POOL_BSCS');
    });

    describe('Database valid service', () => {
        it('consumption towards the procedure', async () => {
            const mockResponse: [unknown[], unknown] = [[{ data: 'test data' }], {}];
            jest.spyOn(sequelize, 'authenticate').mockResolvedValue(undefined);
            jest.spyOn(sequelize, 'query').mockResolvedValue(mockResponse);

            await databaseService.oracleConsumption('30000000', processTime.start());
            expect(sequelize.authenticate).toHaveBeenCalled();
            expect(sequelize.query).toHaveBeenCalled();
          });
    });


})