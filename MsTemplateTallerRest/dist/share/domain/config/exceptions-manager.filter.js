"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExceptionManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionManager = void 0;
const common_1 = require("@nestjs/common");
const apm_service_1 = require("./apm.service");
const business_exceptions_1 = require("../config/business-exceptions");
const constants_1 = require("../resources/constants");
const apiResponse_dto_1 = require("../dto/apiResponse.dto");
const uuid_1 = require("uuid");
const processTime_service_1 = require("./processTime.service");
let ExceptionManager = ExceptionManager_1 = class ExceptionManager {
    constructor(apmService, processTimeService) {
        this.apmService = apmService;
        this.processTimeService = processTimeService;
        this.logger = new common_1.Logger(ExceptionManager_1.name);
    }
    async catch(exception, host) {
        var _a, _b, _c;
        const processTime = this.processTimeService.start();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const correlationId = (0, uuid_1.v4)();
        const request = ctx.getRequest().body ? ctx.getRequest().body : ctx.getRequest().query;
        let result;
        this.logger.log('Iniciando procesamiento de información', `${this.catch.name}`, processTime.end(), correlationId, JSON.stringify(request));
        if (exception instanceof business_exceptions_1.BusinessException || exception instanceof common_1.HttpException || !exception.status) {
            this.apmService.captureError(exception);
        }
        if (exception instanceof business_exceptions_1.BusinessException) {
            result = this.createApiResponse(exception.code, ((_a = exception === null || exception === void 0 ? void 0 : exception.details) === null || _a === void 0 ? void 0 : _a.codMessage) || (exception === null || exception === void 0 ? void 0 : exception.description), ((_b = exception === null || exception === void 0 ? void 0 : exception.details) === null || _b === void 0 ? void 0 : _b.document) || ((_c = exception === null || exception === void 0 ? void 0 : exception.details) === null || _c === void 0 ? void 0 : _c.context) || {}, correlationId);
        }
        else if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            if (status === common_1.HttpStatus.BAD_REQUEST) {
                const responseMessage = this.formatBadRequestMessage(exception);
                result = this.createApiResponse(status, constants_1.ERROR, { errorMessage: responseMessage }, correlationId);
            }
            else {
                result = this.createApiResponse(status, (exception === null || exception === void 0 ? void 0 : exception.getResponse()['message']) || exception.message, (exception === null || exception === void 0 ? void 0 : exception.getResponse()['data']) || (exception === null || exception === void 0 ? void 0 : exception.getResponse()['message']), correlationId);
            }
        }
        else {
            result = this.createApiResponse(common_1.HttpStatus.INTERNAL_SERVER_ERROR, constants_1.EmessageMapping.DEFAULT_ERROR, exception === null || exception === void 0 ? void 0 : exception.message, correlationId);
        }
        this.logger.log('Procesamiento finalizado', `${this.catch.name}`, processTime.end(), correlationId, JSON.stringify(request), JSON.stringify(result));
        response.code(result.responseCode).send(result);
    }
    createApiResponse(responseCode, message, data, correlationId) {
        return new apiResponse_dto_1.ApiResponseDto(responseCode, message, data, correlationId);
    }
    formatBadRequestMessage(exception) {
        var _a;
        const response = exception.getResponse();
        if (typeof response === 'string') {
            return response;
        }
        if (typeof response === 'object' && response !== null) {
            const message = response.message;
            if (Array.isArray(message) && message.every(item => typeof item === 'string')) {
                return message.join(', ');
            }
            if (typeof message === 'string') {
                return message;
            }
            if ((_a = response.response) === null || _a === void 0 ? void 0 : _a.message) {
                return response.response.message;
            }
        }
        return 'Error desconocido en la solicitud';
    }
};
exports.ExceptionManager = ExceptionManager;
exports.ExceptionManager = ExceptionManager = ExceptionManager_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [apm_service_1.ApmService,
        processTime_service_1.ProcessTimeService])
], ExceptionManager);
//# sourceMappingURL=exceptions-manager.filter.js.map