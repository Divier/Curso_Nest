import { FastifyReply } from 'fastify';
import { ProcessTimeService } from '../../share/domain/config/processTime.service';
import { AppLoggerService } from '../../share/domain/config/logger.service';
import { MainExampleRequest } from '../domain/dto/main-example.request.dto';
import { NewContractService } from '../application/restExample.service';
export declare class MainExampleController {
    private readonly serviceRest;
    private readonly processTimeService;
    private readonly logger;
    private readonly transactionId;
    constructor(serviceRest: NewContractService, processTimeService: ProcessTimeService, logger: AppLoggerService);
    restGetPokemonsExampleController(res: FastifyReply, queryParams: MainExampleRequest): Promise<void>;
    restGetPokemonByNameExampleController(res: FastifyReply, name: string): Promise<void>;
}
