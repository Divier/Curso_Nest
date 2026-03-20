import { MainExampleController } from '../../../src/main-example/controller/main-example.controller';
import { MainExampleService } from '../../../src/main-example/application/main-example.service';
import { ProcessTimeService } from '../../../src/share/domain/config/processTime.service';
import { AppLoggerService } from '../../../src/share/domain/config/logger.service';

jest.mock(
	'src/share/domain/config/request-config-http.models',
	() => ({
		EHttpMethod: {
			get: 'GET',
			delete: 'DELETE',
			post: 'POST',
			put: 'PUT',
		},
	}),
	{ virtual: true },
);

describe('MainExampleController', () => {
	let controller: MainExampleController;

	const processTime = {
		end: jest.fn().mockReturnValue(15),
	};

	const mockMainExampleService = {
		consultExecOperationExample: jest.fn(),
	};

	const mockProcessTimeService = {
		start: jest.fn().mockReturnValue(processTime),
	};

	const mockLogger = {
		log: jest.fn(),
		error: jest.fn(),
		warn: jest.fn(),
	};

	const mockConfigService = {
		REST: {
			URL: 'https://pokeapi.co/api/v2/pokemon',
		},
	};

	const buildReply = () => {
		const reply = {
			header: jest.fn().mockReturnThis(),
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		return reply;
	};

	beforeEach(() => {
		controller = new MainExampleController(
			mockMainExampleService as unknown as MainExampleService,
			mockProcessTimeService as unknown as ProcessTimeService,
			mockLogger as unknown as AppLoggerService,
			mockConfigService as any,
		);
		(controller as any).transactionId = 'txn-test';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('restGetPokemonsExampleController', () => {
		it('should call service and send mapped success response', async () => {
			const reply = buildReply();
			const serviceData = { results: [{ name: 'pikachu' }] };

			mockMainExampleService.consultExecOperationExample.mockResolvedValue({
				responseCode: 200,
				message: 'ok',
				data: serviceData,
				timestamp: new Date().toISOString(),
				transactionId: 'external',
			});

			await controller.restGetPokemonsExampleController(reply as any, {
				limit: 10,
				offset: 0,
			});

			expect(mockMainExampleService.consultExecOperationExample).toHaveBeenCalledWith(
				{
					url: 'https://pokeapi.co/api/v2/pokemon',
					method: 'GET',
					params: { limit: 10, offset: 0 },
				},
				processTime,
			);
			expect(reply.header).toHaveBeenCalledWith(
				'Strict-Transport-Security',
				'max-age=31536000; includeSubDomains',
			);
			expect(reply.status).toHaveBeenCalledWith(200);
			expect(reply.send).toHaveBeenCalledWith(
				expect.objectContaining({
					responseCode: 200,
					message: 'Operación exitosa',
					data: serviceData,
					transactionId: 'txn-test',
					timestamp: expect.any(String),
				}),
			);
			expect(mockLogger.log).toHaveBeenCalledTimes(2);
		});
	});

	describe('restGetPokemonByNameExampleController', () => {

		it('should call service and send mapped success response', async () => {
			const reply = buildReply();
			const serviceData = { results: [{ name: 'pikachu' }] };

			mockMainExampleService.consultExecOperationExample.mockResolvedValue({
				responseCode: 200,
				message: 'Operación exitosa',
				data: serviceData,
				timestamp: new Date().toISOString(),
				transactionId: 'external',
			});

			await controller.restGetPokemonByNameExampleController(
				reply as any,
				'pikachu',
			);

			expect(mockMainExampleService.consultExecOperationExample).toHaveBeenCalledWith(
				{
					url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
					method: 'GET',
				},
				processTime,
			);
			expect(reply.status).toHaveBeenCalledWith(200);
			expect(reply.send).toHaveBeenCalledWith(
				expect.objectContaining({
					responseCode: 200,
					message: 'Operación exitosa',
					data: serviceData,
					transactionId: 'txn-test',
					timestamp: expect.any(String),
				}),
			);
		});

		it('should send not found response when service returns 404', async () => {
			const reply = buildReply();

			mockMainExampleService.consultExecOperationExample.mockResolvedValue({
				responseCode: 404,
				message: 'not found',
				data: {},
				timestamp: new Date().toISOString(),
				transactionId: 'external',
			});

			await controller.restGetPokemonByNameExampleController(
				reply as any,
				'missingmon',
			);

			expect(mockMainExampleService.consultExecOperationExample).toHaveBeenCalledWith(
				{
					url: 'https://pokeapi.co/api/v2/pokemon/missingmon',
					method: 'GET',
				},
				processTime,
			);
			expect(reply.status).toHaveBeenCalledWith(404);
			expect(reply.send).toHaveBeenCalledWith(
				expect.objectContaining({
					responseCode: 404,
					message: 'Pokemon missingmon no encontrado',
					transactionId: 'txn-test',
					timestamp: expect.any(String),
				}),
			);
		});
	});
});
