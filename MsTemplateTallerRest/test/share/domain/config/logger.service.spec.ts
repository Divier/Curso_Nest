import { Test, TestingModule } from '@nestjs/testing';
import * as winston from 'winston';
import { AppLoggerService } from '../../../../src/share/domain/config/logger.service';



describe('AppLoggerService', () => {
  let service: AppLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLoggerService],
    }).compile();

    service = module.get<AppLoggerService>(AppLoggerService);
  });

  it('AppLoggerService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AppLoggerService Methods', () => {
    it('should call log', () => {
      service.log('message','contex','metodo', 'processingTime');
      expect(winston.Logger).toBeDefined();
    });

    it('should call debug', () => {
      service.debug('message','contex','metodo', 'processingTime');
      expect(winston.Logger).toBeDefined();
    });

    it('should call debug 2', () => {
      service.debug('message','contex','metodo', null);
      expect(winston.Logger).toBeDefined();
    });

    it('should call error', () => {
      service.error('message','trace','contex','metodo', 'processingTime');
      expect(winston.Logger).toBeDefined();
    });

    it('should call warn', () => {
      service.warn('message','contex','metodo', 'processingTime');
      expect(winston.Logger).toBeDefined();
    });

    it('should call warn 2', () => {
      service.warn('message','contex','metodo', null);
      expect(winston.Logger).toBeDefined();
    });

    it('should call verbose', () => {
      service.verbose('message','contex','metodo', 'processingTime');
      expect(winston.Logger).toBeDefined();
    });

    it('should call verbose 2', () => {
      service.verbose('message','contex','metodo', null);
      expect(winston.Logger).toBeDefined();
    });   
  });
});