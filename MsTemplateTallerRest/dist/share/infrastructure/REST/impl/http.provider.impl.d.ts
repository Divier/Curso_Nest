import { ApmService } from '../../../domain/config/apm.service';
import { IHttpProvider } from "../http.provider";
import { ApiResponseDto } from "../../../domain/dto/apiResponse.dto";
import { Etask } from "../../../domain/resources/constants";
import { IRequestConfigHttp } from "../../../domain/config/request-config-http.models";
import { AppLoggerService } from './../../../domain/config/logger.service';
import { ProcessTimeService } from './../../../domain/config/processTime.service';
export declare class HttpUndiciProvider implements IHttpProvider {
    private readonly apmService;
    private readonly logger;
    private readonly processTime;
    private readonly transactionId;
    constructor(apmService: ApmService, logger: AppLoggerService, processTime: ProcessTimeService);
    executeRest<R = any>(_requestConfig: IRequestConfigHttp, _task?: Etask | string): Promise<ApiResponseDto>;
    private getBody;
    private getUrl;
    private getData;
    private buildAgent;
}
