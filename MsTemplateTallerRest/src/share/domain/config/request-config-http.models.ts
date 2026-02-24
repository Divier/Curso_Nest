/**
 * Intefaz encargada de definir el objeto que se utilizará para hacer el consumo rest
 */
export interface IRequestConfigHttp {
    method: EHttpMethod;
    url: string
    headers?: any;
    params?: any;
    data?: any;
    timeout?: number;
    headersTimeout?: number;
    cert?:string;
    key?:string;
}

/**
 * Enum que difine los tipos de operación que se realizará en el consumo rest
 */
export enum EHttpMethod {
    get = 'GET',
    delete = 'DELETE',
    post = 'POST',
    put = 'PUT',
}