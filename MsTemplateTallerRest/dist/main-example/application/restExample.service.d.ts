import { ConfigType } from '@nestjs/config';
import config from '../../share/domain/resources/env.config';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import { IRequestConfigHttp } from '../../share/domain/config/request-config-http.models';
import { NewContractRequest } from '../domain/dto/restExample.request.dto';
import { AppLoggerService } from '../../share/domain/config/logger.service';
import { ProviderService } from '../infrastructure/infrastructure/rest/impl/provider.service.impl';
export declare class NewContractService {
    private readonly providerService;
    private readonly logger;
    private configService;
    private readonly transactionId;
    constructor(providerService: ProviderService, logger: AppLoggerService, configService: ConfigType<typeof config>);
    procedimientoActivacion(newContractRequest: NewContractRequest, channel: string, processTime: any): Promise<ApiResponseDto>;
    restService(request: IRequestConfigHttp, processTime: any): Promise<ApiResponseDto>;
    createHeadersHttp(channel?: string): {
        channel: string;
    } | {
        channel?: undefined;
    };
    createRequestHttpRest(newContractRequest: NewContractRequest, channel: string): IRequestConfigHttp;
    handleResponseLegacy(response: ApiResponseDto): ApiResponseDto;
}
