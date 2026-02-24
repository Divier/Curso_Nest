export declare class NewContractRequest {
    readonly transactionChannel: string;
    readonly subscriberNumber?: string;
    readonly accountNumber?: string;
    readonly financialDocID?: string;
    readonly financialDocStatus?: string;
    readonly paymentReference?: string;
    readonly dueDateFrom?: string;
    readonly dueDateTo?: string;
    readonly resultLimit: number;
    readonly validarTB?: boolean;
}
