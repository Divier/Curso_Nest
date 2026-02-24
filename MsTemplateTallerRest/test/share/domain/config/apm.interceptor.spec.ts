import { Test, TestingModule } from '@nestjs/testing';
import { ApmInterceptor } from '../../../../src/share/domain/config/apm.interceptor';
import { ApmService } from '../../../../src/share/domain/config/apm.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('ApmInterceptor', () => {
  let interceptor: ApmInterceptor;
  let apmService: ApmService;

  beforeEach(async () => {
    const mockApmService = {
      getCurrentTransaction: jest.fn().mockReturnValue(null), // Mocking the service methods
      startTransaction: jest.fn().mockReturnValue({
        setType: jest.fn(),
        setLabel: jest.fn(),
        end: jest.fn(),
        name: 'unnamed',
        result: '',
      }),
      startSpan: jest.fn().mockReturnValue({
        setLabel: jest.fn(),
        end: jest.fn(),
      }),
      setTransactionName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApmInterceptor,
        { provide: ApmService, useValue: mockApmService },
      ],
    }).compile();

    interceptor = module.get<ApmInterceptor>(ApmInterceptor);
    apmService = module.get<ApmService>(ApmService);
  });

  it('should create a transaction and handle a successful request', async () => {
    const mockExecutionContext: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
        }),
      }),
    } as any;

    const mockCallHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(of('success')),
    };

    await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

    expect(apmService.startTransaction).toHaveBeenCalledWith('GET /test');
    expect(apmService.startSpan).toHaveBeenCalledWith(
      'response_processing',
      'app',
      'response',
      '',
    );
  });

  it('should handle error correctly', async () => {
    const mockExecutionContext: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test-error',
        }),
      }),
    } as any;

    const mockCallHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(throwError(() => new Error('Test error'))),
    };

    await expect(
      interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise(),
    ).rejects.toThrow('Test error');

    expect(apmService.startSpan).toHaveBeenCalledWith(
      'error_handling',
      'app',
      'error',
      '',
    );
  });
});

