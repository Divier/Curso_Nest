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
var HttpUndiciProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpUndiciProvider = void 0;
const common_1 = require("@nestjs/common");
const undici_1 = require("undici");
const apm_service_1 = require("../../../domain/config/apm.service");
const apiResponse_dto_1 = require("../../../domain/dto/apiResponse.dto");
const logger_service_1 = require("./../../../domain/config/logger.service");
const processTime_service_1 = require("./../../../domain/config/processTime.service");
let HttpUndiciProvider = HttpUndiciProvider_1 = class HttpUndiciProvider {
    constructor(apmService, logger, processTime) {
        this.apmService = apmService;
        this.logger = logger;
        this.processTime = processTime;
    }
    async executeRest(_requestConfig, _task) {
        let result;
        let spanIn;
        let requestRest = Object.assign({}, _requestConfig);
        const processT = this.processTime.start();
        try {
            this.logger.log('Iniciando consumo rest', __dirname, `${this.executeRest.name}-${this.getUrl(_requestConfig)}`, processT.end(), this.transactionId, JSON.stringify(_requestConfig));
            spanIn = this.apmService.startSpan(HttpUndiciProvider_1.name, 'Rest', 'executeRest', 'APM');
            const httpResponse = await (0, undici_1.request)(this.getUrl(_requestConfig), {
                method: _requestConfig.method,
                headers: (_requestConfig === null || _requestConfig === void 0 ? void 0 : _requestConfig.headers) || { 'content-type': 'application/json' },
                body: this.getBody(_requestConfig.data),
                dispatcher: new undici_1.Agent(await this.buildAgent(_requestConfig)),
                headersTimeout: requestRest.headersTimeout
            });
            const data = await this.getData(httpResponse);
            result = new apiResponse_dto_1.ApiResponseDto(httpResponse.statusCode, 'Response Rest', data, this.transactionId);
        }
        catch (error) {
            error['config'] = _requestConfig;
            result = new apiResponse_dto_1.ApiResponseDto(error.statusCode, 'Error response consumo rest', error, this.transactionId);
        }
        if (spanIn)
            spanIn.end();
        this.logger.log('Consumo rest finalizado', `${this.executeRest.name}-${this.getUrl(_requestConfig)}`, processT.end(), this.transactionId, JSON.stringify(_requestConfig), JSON.stringify(result));
        return result;
    }
    getBody(data) {
        if (!data)
            return undefined;
        if (typeof data === 'string')
            return data;
        if (typeof data === 'object')
            return JSON.stringify(data);
        return undefined;
    }
    getUrl(requestConfig) {
        if (!requestConfig.params)
            return requestConfig.url;
        return `${requestConfig.url}?${new URLSearchParams(requestConfig.params).toString()}`;
    }
    async getData(response) {
        return response.headers['content-type'].includes('application/json')
            ? response.body.json()
            : response.body.text();
    }
    async buildAgent(_requestConfig) {
        let agentResponse = { connectTimeout: _requestConfig.timeout };
        if (_requestConfig.cert && _requestConfig.key) {
            const keyData = _requestConfig.key.replace(/\\n/g, "\n");
            const crtData = _requestConfig.cert.replace(/\\n/g, "\n");
            agentResponse['connect'] = {
                cert: crtData,
                key: keyData
            };
        }
        else {
            agentResponse['connect'] = {
                rejectUnauthorized: false
            };
        }
        return agentResponse;
    }
};
exports.HttpUndiciProvider = HttpUndiciProvider;
__decorate([
    (0, common_1.Inject)('TransactionId'),
    __metadata("design:type", String)
], HttpUndiciProvider.prototype, "transactionId", void 0);
exports.HttpUndiciProvider = HttpUndiciProvider = HttpUndiciProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [apm_service_1.ApmService,
        logger_service_1.AppLoggerService,
        processTime_service_1.ProcessTimeService])
], HttpUndiciProvider);
//# sourceMappingURL=http.provider.impl.js.map