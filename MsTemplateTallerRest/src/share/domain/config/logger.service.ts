import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { SERVICE_NAME } from '../resources/constants';

/**
 * @description Custom logger implementation for logs 2.0  with winston package
 *
 * @autor Fábrica Microservicios
 *
 */

export class AppLoggerService implements LoggerService {
  loggerWinston: winston.Logger = winston.createLogger({
    format: winston.format.combine(
      winston.format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      winston.format.json()
    ),
    transports: [new winston.transports.Console()],
  });

  log(message: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string) {
    const isTruncated = process.env.RESPONSE_TRUNCATED ==='true';
    const truncateLength = Number.parseInt(process.env.RESPONSE_TRUNCATE_LENGTH || "0");
    response = isTruncated && response && response.length > truncateLength ? 
      response.substring(0, truncateLength) + '...':
      response;
    this.loggerWinston.log(
      new LoggerStructure(methodName, transactionId, request, response, 'info', message, processingTime),
    )
  }

  error(message: any, trace?: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string) {
    this.loggerWinston.error(
      new LoggerStructure(methodName, transactionId, request, response, 'error', message + JSON.stringify(trace), processingTime),
    )
  }
  
  warn(message: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string) {
    this.loggerWinston.warn(
      new LoggerStructure(methodName, transactionId, request, response, 'warn', message, processingTime, ),
    )
  }
  debug?(message: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string) {
    this.loggerWinston.debug(
      new LoggerStructure(methodName, transactionId, request, response, 'debug', message, processingTime),
    )
  }
  verbose?(message: string, methodName?: string, processingTime?: string, transactionId?: string, request?: string, response?: string) {
    this.loggerWinston.verbose(
      new LoggerStructure(methodName, transactionId, request, response, 'verbose', message, processingTime),
    )
  }
}

export class LoggerStructure{
  applicationName: string;

  methodName: string;

  transactionId: string;

  request: string;

  response: string;

  level: string;

  message: string;

  processingTime: string;

  timestamp: string;

  constructor(
    methodname: string,
    transactionId: string,
    request: string,
    response: string,
    level: string,
    message: string,
    processingTime: string,
  ) {
    this.applicationName = `${SERVICE_NAME}`;
    this.methodName = methodname;
    this.transactionId = transactionId;
    this.request = request || "";
    this.response = response || "";
    this.level = level;
    this.message = message;
    this.processingTime = processingTime || "";
    this.timestamp = new Date(Date.now() - (60 * 300000)).toISOString();
  }
}
