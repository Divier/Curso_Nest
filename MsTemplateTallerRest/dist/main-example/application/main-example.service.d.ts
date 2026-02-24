import { ConfigType } from '@nestjs/config';
import config from '../../share/domain/resources/env.config';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import { AppLoggerService } from '../../share/domain/config/logger.service';
import { MainExampleRequest } from '../domain/dto/main-example.request.dto';
export declare class MainExampleService {
    private readonly logger;
    private configService;
    private readonly transactionId;
    constructor(logger: AppLoggerService, configService: ConfigType<typeof config>);
    consultExecOperationExample(mainExampleRequest: MainExampleRequest, processTime: any): Promise<ApiResponseDto>;
    getGroupsFromDto(dtoClass: Function, dtoInstance: any): string[];
}
