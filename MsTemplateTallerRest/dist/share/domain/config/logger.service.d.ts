import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
export declare class AppLoggerService implements LoggerService {
    loggerWinston: winston.Logger;
    log(message: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string): void;
    error(message: any, trace?: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string): void;
    warn(message: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string): void;
    debug?(message: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string): void;
    verbose?(message: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string): void;
}
export declare class LoggerStructure {
    applicationName: string;
    methodName: string;
    transactionId: string;
    request: string;
    response: string;
    level: string;
    message: string;
    processingTime: string;
    timestamp: string;
    constructor(methodname: string, transactionId: string, request: string, response: string, level: string, message: string, processingTime: string);
}
