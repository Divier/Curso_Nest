export interface IRequestConfigHttp {
    method: EHttpMethod;
    url: string;
    headers?: any;
    params?: any;
    data?: any;
    timeout?: number;
    headersTimeout?: number;
    cert?: string;
    key?: string;
}
export declare enum EHttpMethod {
    get = "GET",
    delete = "DELETE",
    post = "POST",
    put = "PUT"
}
