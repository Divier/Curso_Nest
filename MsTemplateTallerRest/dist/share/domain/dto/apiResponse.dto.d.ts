export declare class ApiResponseDto {
    responseCode: number;
    message: string;
    timestamp: string;
    transactionId: string;
    data: any;
    messageCode?: string;
    legacy?: string;
    constructor(responseCode: number, message: string, data: any, transactionId: string, messageCode?: string, legacy?: string);
}
