import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { NewContractService } from '../../../src/restExample/application/restExample.service';
import { IProviderService } from '../../../src/restExample/infrastructure/rest/provider.service';
import { AppLoggerService } from '../../../src/share/domain/config/logger.service';
import { ApiResponseDto } from '../../../src/share/domain/dto/apiResponse.dto';
import { BusinessException } from '../../../src/share/domain/config/business-exceptions';

import { EHttpMethod } from '../../../src/share/domain/config/request-config-http.models';
import config from '../../../src/share/domain/resources/env.config';
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
} from '../../../src/share/domain/resources/constants';

describe('NewContractService', () => {
  let service: NewContractService;
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
      URL: 'http://test.com',
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
        NewContractService,
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

    service = await module.resolve<NewContractService>(NewContractService);
    providerService = await module.resolve<IProviderService>(IProviderService);
    logger = await module.resolve<AppLoggerService>(AppLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('procedimientoActivacion', () => {
    it('should successfully execute and return ApiResponseDto', async () => {
      const mockResponse = new ApiResponseDto(
        HttpStatus.OK,
        OK,
        { data: 'test' },
        'txn-123',
      );
      mockProviderService.executeRest.mockResolvedValue(mockResponse);

      const result = await service.procedimientoActivacion(
        mockNewContractRequest,
        'web',
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
        service.procedimientoActivacion(
          mockNewContractRequest,
          'web',
          mockProcessTime,
        ),
      ).rejects.toThrow(BusinessException);

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('restService', () => {
    it('should call providerService.executeRest with correct parameters', async () => {
      const mockRequest = {
        method: EHttpMethod.get,
        url: 'http://test.com',
        headers: {},
        params: {},
        timeout: 5000,
        headersTimeout: 3000,
      };
      const mockResponse = new ApiResponseDto(HttpStatus.OK, OK, {}, 'txn-123');
      mockProviderService.executeRest.mockResolvedValue(mockResponse);

      const result = await service.restService(mockRequest, mockProcessTime);

      expect(providerService.executeRest).toHaveBeenCalledWith(
        mockRequest,
        Etask.CONSUMO_SERVICIO_REST,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw BusinessException on error', async () => {
      const mockRequest = {
        method: EHttpMethod.get,
        url: 'http://test.com',
        headers: {},
        params: {},
        timeout: 5000,
        headersTimeout: 3000,
      };
      const error = new Error('Service error');
      mockProviderService.executeRest.mockRejectedValue(error);

      await expect(
        service.restService(mockRequest, mockProcessTime),
      ).rejects.toThrow(BusinessException);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('createHeadersHttp', () => {
    it('should return headers with channel when provided', () => {
      const result = service.createHeadersHttp('mobile');

      expect(result).toEqual({ channel: 'mobile' });
    });

    it('should return empty object when channel is not provided', () => {
      const result = service.createHeadersHttp();

      expect(result).toEqual({});
    });

    it('should return empty object when channel is undefined', () => {
      const result = service.createHeadersHttp(undefined);

      expect(result).toEqual({});
    });
  });

  describe('createRequestHttpRest', () => {
    it('should create correct request object with channel', () => {
      const result = service.createRequestHttpRest(
        mockNewContractRequest,
        'web',
      );

      expect(result).toEqual({
        method: EHttpMethod.get,
        url: 'http://test.com',
        headers: { channel: 'web' },
        params: mockNewContractRequest,
        timeout: 5000,
        headersTimeout: 3000,
      });
    });
  });

  describe('handleResponseLegacy', () => {
    it('should handle timeout error response', () => {
      const mockResponse = new ApiResponseDto(
        undefined,
        '',
        { code: ERROR_TIMEOUT },
        'txn-123',
      );

      const result = service.handleResponseLegacy(mockResponse);

      expect(result.responseCode).toBe(HttpStatus.GATEWAY_TIMEOUT);
      expect(result.message).toBe(MSG_504);
      expect(result.data.billing.responseStatus.code).toBe(
        HttpStatus.GATEWAY_TIMEOUT.toString(),
      );
      expect(result.data.billing.responseStatus.message).toBe(MSG_LEGACY_504);
      expect(result.data.billing.responseStatus.status).toBe(ERROR);
    });

    it('should handle service unavailable response', () => {
      const mockResponse = new ApiResponseDto(
        HttpStatus.SERVICE_UNAVAILABLE,
        '',
        {},
        'txn-123',
      );

      const result = service.handleResponseLegacy(mockResponse);

      expect(result.responseCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(result.message).toBe(MSG_503);
      expect(result.data.billing.responseStatus.code).toBe(
        HttpStatus.SERVICE_UNAVAILABLE.toString(),
      );
      expect(result.data.billing.responseStatus.message).toBe(MSG_LEGACY_503);
      expect(result.data.billing.responseStatus.status).toBe(ERROR);
    });

    it('should handle successful OK response', () => {
      const mockData = { data: { result: 'success' } };
      const mockResponse = new ApiResponseDto(
        HttpStatus.OK,
        '',
        mockData,
        'txn-123',
      );

      const result = service.handleResponseLegacy(mockResponse);

      expect(result.responseCode).toBe(HttpStatus.OK);
      expect(result.message).toBe(OK);
      expect(result.data).toEqual({ result: 'success' });
    });

    it('should return response as-is for other status codes', () => {
      const mockResponse = new ApiResponseDto(
        HttpStatus.BAD_REQUEST,
        'Bad Request',
        { error: 'test' },
        'txn-123',
      );

      const result = service.handleResponseLegacy(mockResponse);

      expect(result).toEqual(mockResponse);
    });
  });
});
