export interface ResponseStatus {
    code: string;
    message: string;
    status: string;
}
export interface BillingResponse {
    responseStatus: ResponseStatus;
}
export interface ResponseLegacy {
    billing: BillingResponse;
}
