import 'dotenv/config';
import * as apm from 'elastic-apm-node';
export declare class ApmService {
    constructor();
    isStarted(): boolean;
    captureError(data: any): void;
    startTransaction(name: string): any;
    setTransactionName(name: string): void;
    endTransaction(): void;
    startSpan(name: string, type: string, subtype: string, action: string): apm.Span;
    getCurrentTransaction(): apm.Transaction;
}
