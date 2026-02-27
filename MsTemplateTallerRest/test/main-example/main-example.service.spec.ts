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
import { IProviderService } from '../../src/main-example/infrastructure/infrastructure/rest/provider.service';

describe('MainExampleService', () => {
  let service: MainExampleService;
  let providerService: IProviderService;
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
      URL: 'https://pokeapi.co/api/v2/pokemon',
      TIMEOUT: 5000,
      HEADERS_TIMEOUT: 3000,
    },
  };

  const mockProcessTime = {
    end: jest.fn().mockReturnValue(100),
  };

  const mockNewContractRequest = {
    param1: 'value1',
    param2: 'value2',
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MainExampleService,
        {
          provide: IProviderService,
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
    providerService = await module.resolve<IProviderService>(IProviderService);
    logger = await module.resolve<AppLoggerService>(AppLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consultExecOperationExample', () => {
    it('should successfully execute and return ApiResponseDto', async () => {
      const mockResponse = new ApiResponseDto(
        HttpStatus.OK,
        OK,
        { data: 'test' },
        'txn-123',
      );
      mockProviderService.executeRest.mockResolvedValue(mockResponse);

      const result = await service.consultExecOperationExample(
        mockNewContractRequest,
        mockProcessTime,
      );

      expect(result).toBeDefined();
      expect(result.responseCode).toBe(HttpStatus.OK);
      expect(result.message).toBe(OK);
    });

    it('should throw BusinessException on error', async () => {
      const error = new Error('Test error');
      mockProviderService.executeRest.mockRejectedValue(error);

      await expect(
        service.consultExecOperationExample(
          mockNewContractRequest,
          mockProcessTime,
        ),
      ).rejects.toThrow(BusinessException);

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
