import { IHttpProvider } from "src/share/infrastructure/REST/http.provider";
export declare abstract class IProviderService extends IHttpProvider {
    abstract executeRestImpl<R = any>(_requestConfig: any, _task?: any): Promise<any>;
}
