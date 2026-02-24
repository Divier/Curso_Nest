"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerStructure = exports.AppLoggerService = void 0;
const winston = require("winston");
const constants_1 = require("../resources/constants");
class AppLoggerService {
    constructor() {
        this.loggerWinston = winston.createLogger({
            format: winston.format.combine(winston.format((info) => {
                info.level = info.level.toUpperCase();
                return info;
            })(), winston.format.json()),
            transports: [new winston.transports.Console()],
        });
    }
    log(message, methodName, processingTime, transactionId, request, response) {
        const isTruncated = process.env.TRUNCATED_RESPONSE === 'true';
        const truncateLength = Number.parseInt(process.env.CHARACTERS || "0");
        response = isTruncated && response && response.length > truncateLength ?
            response.substring(0, truncateLength) + '...' :
            response;
        this.loggerWinston.log(new LoggerStructure(methodName, transactionId, request, response, 'info', message, processingTime));
    }
    error(message, trace, methodName, processingTime, transactionId, request, response) {
        this.loggerWinston.error(new LoggerStructure(methodName, transactionId, request, response, 'error', message + JSON.stringify(trace), processingTime));
    }
    warn(message, methodName, processingTime, transactionId, request, response) {
        this.loggerWinston.warn(new LoggerStructure(methodName, transactionId, request, response, 'warn', message, processingTime));
    }
    debug(message, methodName, processingTime, transactionId, request, response) {
        this.loggerWinston.debug(new LoggerStructure(methodName, transactionId, request, response, 'debug', message, processingTime));
    }
    verbose(message, methodName, processingTime, transactionId, request, response) {
        this.loggerWinston.verbose(new LoggerStructure(methodName, transactionId, request, response, 'verbose', message, processingTime));
    }
}
exports.AppLoggerService = AppLoggerService;
class LoggerStructure {
    constructor(methodname, transactionId, request, response, level, message, processingTime) {
        this.applicationName = `${constants_1.SERVICE_NAME}`;
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
exports.LoggerStructure = LoggerStructure;
//# sourceMappingURL=logger.service.js.map