import { Etask } from '../../domain/resources/constants';
import { ApiResponseDto } from '../../domain/dto/apiResponse.dto';
import { IRequestConfigHttp } from '../../domain/config/request-config-http.models';
export declare abstract class IHttpProvider {
    abstract executeRest<R = any>(_requestConfig: IRequestConfigHttp, _task?: Etask | string): Promise<ApiResponseDto>;
}
