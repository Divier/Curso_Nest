import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionManager } from '../../../../src/share/domain/config/exceptions-manager.filter';
import { ApmService } from '../../../../src/share/domain/config/apm.service';
import { BusinessException } from '../../../../src/share/domain/config/business-exceptions';
import { ApiResponseDto } from '../../../../src/share/domain/dto/apiResponse.dto';
import { EmessageMapping,Etask } from '../../../../src/share/domain/resources/constants';
import { ProcessTimeService } from './../../../../src/share/domain/config/processTime.service';

describe('ExceptionManager', () => {
  let exceptionManager: ExceptionManager;
  let mockApmService: jest.Mocked<ApmService>;
  let processtime: ProcessTimeService;
  beforeEach(() => {
    mockApmService = {
      captureError: jest.fn(),
    } as any;
    processtime = new ProcessTimeService();
    exceptionManager = new ExceptionManager(mockApmService, processtime);
    
  });

  const createMockHost = (code: jest.Mock, send: jest.Mock, query?: jest.Mock): ArgumentsHost =>
    ({
      switchToHttp: () => ({
        getResponse: () => ({
          code,
        }),
        getRequest: () =>({
          query
        })
      }),
    } as unknown as ArgumentsHost);

  it('should handle BusinessException with details', async () => {
    const exception = new BusinessException(400, 'Some description', false, {
      codMessage: EmessageMapping.DEFAULT_ERROR,
      context: 'context-value',
    });

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const query = jest.fn();
    const request = jest.fn().mockReturnValue({ query });
    const mockHost = createMockHost(code, send, request);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).toHaveBeenCalledWith(exception);
    expect(code).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });

  it('should handle BusinessException with all optional details', async () => {
    const exception = new BusinessException(
      422,
      'Unprocessable entity',
      false,
      {
        codMessage: EmessageMapping.CAMPOS_OBLIGATORIOS,
        context: 'form input',
        task: Etask.CHANNEL_ERROR,
        document: { id: 123, name: 'doc' }
      }
    );

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const mockHost = createMockHost(code, send);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).toHaveBeenCalledWith(exception);
    expect(code).toHaveBeenCalledWith(422);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });

  it('should handle BusinessException without details', async () => {
    const exception = new BusinessException(409, 'No details');

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const mockHost = createMockHost(code, send);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).toHaveBeenCalledWith(exception);
    expect(code).toHaveBeenCalledWith(409);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });

  it('should handle HttpException with message as string', async () => {
    const exception = new HttpException('Invalid request', HttpStatus.BAD_REQUEST);

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const mockHost = createMockHost(code, send);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).toHaveBeenCalledWith(exception);
    expect(code).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });

  it('should handle HttpException with message array', async () => {
    const exception = new HttpException({ message: ['field is required', 'another error'] }, HttpStatus.BAD_REQUEST);

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const mockHost = createMockHost(code, send);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).toHaveBeenCalledWith(exception);
    expect(code).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });

  it('should handle HttpException with nested response.message', async () => {
    const exception = new HttpException({ response: { message: 'Nested error' } }, HttpStatus.BAD_REQUEST);

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const mockHost = createMockHost(code, send);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).toHaveBeenCalledWith(exception);
    expect(code).toHaveBeenCalledWith(400);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });

  it('should handle HttpException with status other than 400', async () => {
    const exception = new HttpException({ message: 'Not found', data: 'extra' }, HttpStatus.NOT_FOUND);

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const mockHost = createMockHost(code, send);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).toHaveBeenCalledWith(exception);
    expect(code).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });

  it('should handle unknown errors without status', async () => {
    const exception = new Error('Unexpected failure');

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const mockHost = createMockHost(code, send);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).toHaveBeenCalledWith(exception);
    expect(code).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });

  it('should not call captureError when exception has status but is not HttpException or BusinessException', async () => {
    const exception = { message: 'Something went wrong', status: 401 };

    const send = jest.fn();
    const code = jest.fn().mockReturnValue({ send });
    const mockHost = createMockHost(code, send);

    await exceptionManager.catch(exception, mockHost);

    expect(mockApmService.captureError).not.toHaveBeenCalled();
    expect(code).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith(expect.any(ApiResponseDto));
  });
});
