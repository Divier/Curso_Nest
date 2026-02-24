import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { ApmService } from './apm.service';
import { ProcessTimeService } from './processTime.service';
export declare class ExceptionManager implements ExceptionFilter {
    private readonly apmService;
    private readonly processTimeService;
    private readonly logger;
    constructor(apmService: ApmService, processTimeService: ProcessTimeService);
    catch(exception: any, host: ArgumentsHost): Promise<void>;
    private createApiResponse;
    private formatBadRequestMessage;
}
