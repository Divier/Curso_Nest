import { HttpUndiciProvider } from "src/share/infrastructure/REST/impl/http.provider.impl";
import { IProviderService } from "../provider.service";
import { IRequestConfigHttp } from "src/share/domain/config/request-config-http.models";
export declare class ProviderService extends HttpUndiciProvider implements IProviderService {
    executeRestImpl<R = any>(_requestConfig: IRequestConfigHttp, _task?: any): Promise<any>;
}
