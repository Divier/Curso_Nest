import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ApmService } from '../../../../src/share/domain/config/apm.service';
import configuration from '../../../../src/share/domain/resources/env.config';
import * as apm from 'elastic-apm-node';

jest.mock('elastic-apm-node');

describe('ApmService', () => {
  let service: ApmService;

  beforeEach(async () => {
    (apm.isStarted as jest.Mock).mockClear();
    (apm.start as jest.Mock).mockClear();
    (apm.captureError as jest.Mock).mockClear();
    (apm.startTransaction as jest.Mock).mockClear();
    (apm.setTransactionName as jest.Mock).mockClear();
    (apm.endTransaction as jest.Mock).mockClear();
    (apm.startSpan as jest.Mock).mockClear();
    //(apm.currentTransaction as jest.Mock).mockClear();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
      ],
      providers: [ApmService],
    }).compile();

    service = module.get<ApmService>(ApmService);
  });

  it('apmService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('new Apm Methods', () => {
    it('should call isStarted', () => {
      service.isStarted();
      expect(apm.isStarted).toHaveBeenCalled();
    });

    it('should call captureError', () => {
      const error = new Error('Test error');
      service.captureError(error);
      expect(apm.captureError).toHaveBeenCalledWith(error);
    });

    it('should call startTransaction', () => {
      const transactionName = 'testTransaction';
      service.startTransaction(transactionName);
      expect(apm.startTransaction).toHaveBeenCalledWith(transactionName);
    });

    it('should call setTransactionName', () => {
      const transactionName = 'testTransaction';
      service.setTransactionName(transactionName);
      expect(apm.setTransactionName).toHaveBeenCalledWith(transactionName);
    });

    it('should call endTransaction', () => {
      service.endTransaction();
      expect(apm.endTransaction).toHaveBeenCalled();
    });

    it('should call startSpan', () => {
      const spanName = 'testSpan';
      const spanType = 'testType';
      const spanSubtype = 'testSubtype';
      const spanAction = 'testAction';
      service.startSpan(spanName, spanType, spanSubtype, spanAction);
      expect(apm.startSpan).toHaveBeenCalledWith(spanName, spanType, spanSubtype, spanAction);
    });

    it('should return null if APM is not started', () => {
      (apm.isStarted as jest.Mock).mockReturnValue(false);
      const result = service.getCurrentTransaction();
      expect(result).toBeNull();
    });

    it('apmService should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('Apm Methods', () => {
      it('should call isStarted', () => {
        service.isStarted();
      });

      it('should call captureError', () => {
        service.captureError({});
      });

      it('should call startTransaction', () => {
        service.startTransaction('name');
      });

      it('should call setTransactionName', () => {
        service.setTransactionName('name');
      });

      it('should call endTransaction', () => {
        service.endTransaction();
      });

      it('should call startSpan', () => {
        service.startSpan('name', 'type', 'subtype', 'action');
      });
    });
  });
});