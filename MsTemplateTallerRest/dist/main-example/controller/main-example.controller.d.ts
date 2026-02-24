import { FastifyReply } from 'fastify';
import { ProcessTimeService } from '../../share/domain/config/processTime.service';
import { AppLoggerService } from '../../share/domain/config/logger.service';
import { MainExampleService } from '../application/main-example.service';
import { MainExampleRequest } from '../domain/dto/main-example.request.dto';
export declare class MainExampleController {
    private readonly service;
    private readonly processTimeService;
    private readonly logger;
    private readonly transactionId;
    constructor(service: MainExampleService, processTimeService: ProcessTimeService, logger: AppLoggerService);
    restExampleController(res: FastifyReply, payload: MainExampleRequest): Promise<void>;
}
