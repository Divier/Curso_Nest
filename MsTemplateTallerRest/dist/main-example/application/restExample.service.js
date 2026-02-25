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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewContractService = void 0;
const common_1 = require("@nestjs/common");
const env_config_1 = require("../../share/domain/resources/env.config");
const business_exceptions_1 = require("../../share/domain/config/business-exceptions");
const apiResponse_dto_1 = require("../../share/domain/dto/apiResponse.dto");
const request_config_http_models_1 = require("../../share/domain/config/request-config-http.models");
const constants_1 = require("../../share/domain/resources/constants");
const logger_service_1 = require("../../share/domain/config/logger.service");
const provider_service_impl_1 = require("../infrastructure/infrastructure/rest/impl/provider.service.impl");
let NewContractService = class NewContractService {
    constructor(providerService, logger, configService) {
        this.providerService = providerService;
        this.logger = logger;
        this.configService = configService;
    }
    async procedimientoActivacion(newContractRequest, channel, processTime) {
        try {
            const requestLegacy = this.createRequestHttpRest(newContractRequest, channel);
            const responseLegacy = await this.restService(requestLegacy, processTime);
            return this.handleResponseLegacy(responseLegacy);
        }
        catch (error) {
            this.logger.error(error.message, error.stack, __dirname, this.procedimientoActivacion.name, processTime.end(), this.transactionId);
            throw new business_exceptions_1.BusinessException(common_1.HttpStatus.INTERNAL_SERVER_ERROR, constants_1.MSG_500, false, {
                codMessage: error.message,
                context: 'procedimientoActivacion',
            });
        }
    }
    async restService(request, processTime) {
        try {
            return await this.providerService.executeRest(request, constants_1.Etask.CONSUMO_SERVICIO_REST);
        }
        catch (error) {
            this.logger.error(error.message, error.stack, __dirname, this.procedimientoActivacion.name, processTime.end(), this.transactionId);
            throw new business_exceptions_1.BusinessException(common_1.HttpStatus.INTERNAL_SERVER_ERROR, constants_1.MSG_500, false, {
                codMessage: error.message,
                context: 'restService',
            });
        }
    }
    createHeadersHttp(channel) {
        return channel ? { channel: channel } : {};
    }
    createRequestHttpRest(newContractRequest, channel) {
        return {
            method: request_config_http_models_1.EHttpMethod.get,
            url: this.configService.REST.URL,
            headers: Object.assign({}, this.createHeadersHttp(channel)),
            params: Object.assign({}, newContractRequest),
            timeout: this.configService.REST.TIMEOUT,
            headersTimeout: this.configService.REST.HEADERS_TIMEOUT,
        };
    }
    handleResponseLegacy(response) {
        var _a, _b;
        let responseLegacy;
        if (response.responseCode === undefined &&
            ((_a = response.data) === null || _a === void 0 ? void 0 : _a.code) === constants_1.ERROR_TIMEOUT) {
            responseLegacy = {
                billing: {
                    responseStatus: {
                        code: common_1.HttpStatus.GATEWAY_TIMEOUT.toString(),
                        message: constants_1.MSG_LEGACY_504,
                        status: constants_1.ERROR,
                    },
                },
            };
            return new apiResponse_dto_1.ApiResponseDto(common_1.HttpStatus.GATEWAY_TIMEOUT, constants_1.MSG_504, Object.assign({}, responseLegacy), response.transactionId);
        }
        if (response.responseCode === common_1.HttpStatus.SERVICE_UNAVAILABLE) {
            responseLegacy = {
                billing: {
                    responseStatus: {
                        code: common_1.HttpStatus.SERVICE_UNAVAILABLE.toString(),
                        message: constants_1.MSG_LEGACY_503,
                        status: constants_1.ERROR,
                    },
                },
            };
            response.data = Object.assign({}, responseLegacy);
            response.message = constants_1.MSG_503;
            return response;
        }
        if (response.responseCode === common_1.HttpStatus.OK) {
            response.message = constants_1.OK;
            response.data = Object.assign({}, (_b = response.data) === null || _b === void 0 ? void 0 : _b.data);
            return response;
        }
        return response;
    }
};
exports.NewContractService = NewContractService;
__decorate([
    (0, common_1.Inject)('TransactionId'),
    __metadata("design:type", String)
], NewContractService.prototype, "transactionId", void 0);
exports.NewContractService = NewContractService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(2, (0, common_1.Inject)(env_config_1.default.KEY)),
    __metadata("design:paramtypes", [provider_service_impl_1.ProviderService,
        logger_service_1.AppLoggerService, void 0])
], NewContractService);
//# sourceMappingURL=restExample.service.js.map