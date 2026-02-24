import { EmessageMapping, Etask } from "./../resources/constants";
export declare class BusinessException {
    readonly code: number;
    readonly description: string;
    readonly success: boolean;
    readonly details?: IoptionalDetails;
    constructor(code: number, description: string, success?: boolean, details?: IoptionalDetails);
}
export interface IoptionalDetails {
    readonly codMessage?: EmessageMapping;
    readonly context?: string;
    readonly task?: Etask;
    readonly document?: any;
}
