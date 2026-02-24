import { Test, TestingModule } from '@nestjs/testing';
import { OracleExampleService } from '../../../src/oracleExample/application/oracleExample.service';
import { OracleExampleController } from '../../../src/oracleExample/controller/oracleExample.controller';
import { ApmService } from '../../../src/share/domain/config/apm.service';
import { AppLoggerService } from '../../../src/share/domain/config/logger.service';
import { OracleExampleOracleService } from '../../../src/oracleExample/infraestructure/oracle/oracleExample.oracle.service';
import { ProcessTimeService } from '../../../src/share/domain/config/processTime.service';
jest.mock('./../../../src/oracleExample/infraestructure/oracle/oracleExample.oracle.service');
describe('Validate service module', () =>{
    let service: OracleExampleService;
    let db: OracleExampleOracleService
    let processTime: ProcessTimeService;
    const transactionId = 'test-transaction-id';
    beforeEach(async () =>{
        const module: TestingModule = await Test.createTestingModule(
            {
                providers:[
                   ApmService,
                   OracleExampleService,
                   AppLoggerService,
                   OracleExampleOracleService,
                   ProcessTimeService,
                   { provide: 'TransactionId', useValue: transactionId },
            ],
                controllers:[
                   OracleExampleController
            ]
            }
        ).compile();
        service = module.get<OracleExampleService>(OracleExampleService);
        db = module.get<OracleExampleOracleService>(OracleExampleOracleService);
        processTime = module.get<ProcessTimeService>(ProcessTimeService);
    });

    describe('Validate service', () =>{
        it('consumption towards the procedure', async () => {
            expect(service).toBeDefined();
        });

        it('OK Consumption', async () =>{
            jest
                .spyOn(db, 'oracleConsumption')
                .mockResolvedValue({
                   P_VC_MSISDN: '3000000000',
                   P_NM_COD_BANCO: 1234,
                   P_VC_CAMBIO_SIM: 'SI',
                   P_DT_FEC_CAMBIO_SIM: new Date(),
                   P_VC_SALIDA: '1;OK'                      
                });
            const response = await service.main({'min':'3000000000'}, processTime.start())
            expect(response.responseCode).toBe(200);
        });

        it('Catch Consumption', async () =>{
            jest
                .spyOn(db, 'oracleConsumption')
                .mockRejectedValue({
                   P_VC_MSISDN: '3000000000',
                   P_NM_COD_BANCO: 1234,
                   P_VC_CAMBIO_SIM: 'SI',
                   P_DT_FEC_CAMBIO_SIM: new Date(),
                   P_VC_SALIDA: '1;OK'                      
                });
            try{
                await service.main({'min':'3000000000'}, processTime.start())
            }catch(error){
                expect(500);
            } 
            
        });

        it('OK No cambioSim Consumption', async () =>{
            jest
                .spyOn(db, 'oracleConsumption')
                .mockResolvedValue({
                   P_VC_MSISDN: '3000000000',
                   P_NM_COD_BANCO: 1234,
                   P_VC_CAMBIO_SIM: 'NO',
                   P_DT_FEC_CAMBIO_SIM: new Date(),
                   P_VC_SALIDA: '1;OK'                      
                });
            const response = await service.legacyConsumption('3000000000', processTime.start())
            expect(response.cambioSim).toBe('NO');
        });

        it('Legacy error response Consumption', async () =>{
            jest
                .spyOn(db, 'oracleConsumption')
                .mockResolvedValue({
                   P_VC_MSISDN: '3000000000',
                   P_NM_COD_BANCO: 1234,
                   P_VC_CAMBIO_SIM: 'NO',
                   P_DT_FEC_CAMBIO_SIM: new Date(),
                   P_VC_SALIDA: 'error'                      
                });
            const response = await service.legacyConsumption('3000000000', processTime.start())
            expect(response.cambioSim).toBe('NO');
        });
    })
});