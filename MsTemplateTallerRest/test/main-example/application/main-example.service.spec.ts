import { HttpStatus } from '@nestjs/common';
import { MainExampleService } from '../../../src/main-example/application/main-example.service';
import { AppLoggerService } from '../../../src/share/domain/config/logger.service';
import { ApiResponseDto } from '../../../src/share/domain/dto/apiResponse.dto';
import { Etask, MSG_500, OK } from '../../../src/share/domain/resources/constants';
import { ProviderService } from '../../../src/main-example/infrastructure/infrastructure/rest/impl/provider.service.impl';

describe('MainExampleService', () => {
	let service: MainExampleService;

	const mockProviderService = {
		executeRest: jest.fn(),
	};

	const mockLogger = {
		error: jest.fn(),
		log: jest.fn(),
		warn: jest.fn(),
	};

	const mockProcessTime = {
		end: jest.fn().mockReturnValue(100),
	};

	const mockRequest = {
		method: 'GET',
		url: 'https://pokeapi.co/api/v2/pokemon',
		params: { limit: 10, offset: 0 },
	} as any;

	beforeEach(() => {
		service = new MainExampleService(
			mockLogger as unknown as AppLoggerService,
			mockProviderService as unknown as ProviderService,
		);
		(service as any).transactionId = 'test-transaction-id';
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
				mockRequest,
				mockProcessTime,
			);

			expect(result).toBeDefined();
			expect(result.responseCode).toBe(HttpStatus.OK);
			expect(result.message).toBe(OK);
			expect(mockProviderService.executeRest).toHaveBeenCalledWith(
				mockRequest,
				Etask.CONSUMO_SERVICIO_REST,
			);
		});

		it('should log and throw BusinessException on provider error', async () => {
			const error = new Error('Test error');
			mockProviderService.executeRest.mockRejectedValue(error);

			await expect(
				service.consultExecOperationExample(mockRequest, mockProcessTime),
			).rejects.toEqual(
				expect.objectContaining({
					code: HttpStatus.INTERNAL_SERVER_ERROR,
					description: MSG_500,
					success: false,
					details: expect.objectContaining({
						codMessage: 'Test error',
						context: 'consultExecOperationExample',
					}),
				}),
			);

			expect(mockLogger.error).toHaveBeenCalledWith(
				error.message,
				error.stack,
				expect.any(String),
				'consultExecOperationExample',
				100,
				'test-transaction-id',
			);
			expect(mockProcessTime.end).toHaveBeenCalled();
		});
	});
});
