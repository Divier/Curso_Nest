import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AppLoggerService } from '../../src/share/domain/config/logger.service';
import { ApiResponseDto } from '../../src/share/domain/dto/apiResponse.dto';
import { BusinessException } from '../../src/share/domain/config/business-exceptions';

import config from '../../src/share/domain/resources/env.config';
import {
  ERROR,
  ERROR_TIMEOUT,
  Etask,
  MSG_500,
  MSG_503,
  MSG_504,
  MSG_LEGACY_503,
  MSG_LEGACY_504,
  OK,
} from '../../src/share/domain/resources/constants';
import { MainExampleService } from '../../src/main-example/application/main-example.service';
//import { IProviderService } from '../../src/main-example/infrastructure/infrastructure/rest/provider.service';
import { EHttpMethod } from '../../src/share/domain/config/request-config-http.models';
import { ProviderService } from '../../src/main-example/infrastructure/infrastructure/rest/impl/provider.service.impl';

describe('MainExampleService', () => {
    let service: MainExampleService;
    let providerService: ProviderService;
    let logger: AppLoggerService;
  
    const mockProviderService = {
      executeRest: jest.fn(),
    };
  
    const mockLogger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    };
  
    const mockConfigService = {
      REST: {
        URL: 'https://pokeapi.co/api/v2/pokemo',
        TIMEOUT: 5000,
        HEADERS_TIMEOUT: 3000,
      },
    };
  
    const mockProcessTime = {
      end: jest.fn().mockReturnValue(100),
    };
  
    const mockNewRequest = {
      limit: 5,
      offset: 1,
    } as any;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MainExampleService,
          {
            provide: ProviderService,
            useValue: mockProviderService,
          },
          {
            provide: AppLoggerService,
            useValue: mockLogger,
          },
          {
            provide: config.KEY,
            useValue: mockConfigService,
          },
          {
            provide: 'TransactionId',
            useValue: 'test-transaction-id',
          },
        ],
      }).compile();
  
      service = await module.resolve<MainExampleService>(MainExampleService);
      providerService = await module.resolve<ProviderService>(ProviderService);
      logger = await module.resolve<AppLoggerService>(AppLoggerService);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });

  describe('consultExecOperationExample', () => {
    it('should successfully execute and return ApiResponseDto', async () => {
      

      const mockRequest = {
              method: EHttpMethod.get,
              url: 'http://test.com',
              headers: {},
              params: {
                limit: 5,
                offset: 1,
              },
              timeout: 5000,
              headersTimeout: 3000,
            };
            const mockResponse = new ApiResponseDto(HttpStatus.OK, OK, {}, 'txn-123');
            mockProviderService.executeRest.mockResolvedValue(mockResponse);
      
            const result = await service.consultExecOperationExample(mockRequest, mockProcessTime);
      
            console.log('Result:', result);

            expect(providerService.executeRest).toHaveBeenCalledWith(
              mockRequest,
              Etask.CONSUMO_SERVICIO_REST,
            );
            expect(result).toEqual(mockResponse);


    });

    it('should throw BusinessException on error', async () => {
      const error = new Error('Test error');
      mockProviderService.executeRest.mockRejectedValue(error);

      await expect(
        service.consultExecOperationExample(
          mockNewRequest,
          mockProcessTime,
        ),
      ).rejects.toThrow(BusinessException);

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
