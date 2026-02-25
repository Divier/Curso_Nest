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
exports.MainExampleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const processTime_service_1 = require("../../share/domain/config/processTime.service");
const apiResponse_dto_1 = require("../../share/domain/dto/apiResponse.dto");
const apm_interceptor_1 = require("../../share/domain/config/apm.interceptor");
const logger_service_1 = require("../../share/domain/config/logger.service");
const main_example_request_dto_1 = require("../domain/dto/main-example.request.dto");
const restExample_service_1 = require("../application/restExample.service");
const request_config_http_models_1 = require("../../share/domain/config/request-config-http.models");
let MainExampleController = class MainExampleController {
    constructor(serviceRest, processTimeService, logger) {
        this.serviceRest = serviceRest;
        this.processTimeService = processTimeService;
        this.logger = logger;
    }
    async restGetPokemonsExampleController(res, queryParams) {
        const processTime = this.processTimeService.start();
        let serviceResponse;
        const payload = {
            url: `https://pokeapi.co/api/v2/pokemon`,
            method: request_config_http_models_1.EHttpMethod.get,
            params: {
                limit: queryParams.limit,
                offset: queryParams.offset,
            },
        };
        try {
            this.logger.log('Iniciando procesamiento de información', `${this.restGetPokemonsExampleController.name}`, processTime.end(), this.transactionId, JSON.stringify(payload));
            serviceResponse = await this.serviceRest.restService(payload, processTime);
            serviceResponse = {
                responseCode: 200,
                message: 'Operación exitosa',
                data: serviceResponse.data,
                timestamp: new Date().toISOString(),
                transactionId: this.transactionId,
            };
            res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            res.status(serviceResponse.responseCode).send(serviceResponse);
        }
        finally {
            this.logger.log('Procesamiento finalizado', `${this.restGetPokemonsExampleController.name}`, processTime.end(), this.transactionId, JSON.stringify(payload), JSON.stringify(serviceResponse));
        }
    }
    async restGetPokemonByNameExampleController(res, name) {
        const processTime = this.processTimeService.start();
        let serviceResponse;
        const payload = {
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            method: request_config_http_models_1.EHttpMethod.get,
        };
        try {
            this.logger.log('Iniciando procesamiento de información', `${this.restGetPokemonByNameExampleController.name}`, processTime.end(), this.transactionId, JSON.stringify(payload));
            serviceResponse = await this.serviceRest.restService(payload, processTime);
            if (serviceResponse.responseCode === 404) {
                serviceResponse = {
                    responseCode: 404,
                    message: `Pokemon ${name} no encontrado`,
                    data: serviceResponse.data,
                    timestamp: new Date().toISOString(),
                    transactionId: this.transactionId,
                };
            }
            else {
                serviceResponse = {
                    responseCode: 200,
                    message: 'Operación exitosa',
                    data: serviceResponse.data,
                    timestamp: new Date().toISOString(),
                    transactionId: this.transactionId,
                };
            }
            res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            res.status(serviceResponse.responseCode).send(serviceResponse);
        }
        finally {
            this.logger.log('Procesamiento finalizado', `${this.restGetPokemonByNameExampleController.name}`, processTime.end(), this.transactionId, JSON.stringify(payload), JSON.stringify(serviceResponse));
        }
    }
};
exports.MainExampleController = MainExampleController;
__decorate([
    (0, common_1.Inject)('TransactionId'),
    __metadata("design:type", String)
], MainExampleController.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: apiResponse_dto_1.ApiResponseDto,
        status: 200,
    }),
    (0, common_1.Get)('getPokemons'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, main_example_request_dto_1.MainExampleRequest]),
    __metadata("design:returntype", Promise)
], MainExampleController.prototype, "restGetPokemonsExampleController", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: apiResponse_dto_1.ApiResponseDto,
        status: 200,
    }),
    (0, common_1.Get)('getPokemonByName/:name'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MainExampleController.prototype, "restGetPokemonByNameExampleController", null);
exports.MainExampleController = MainExampleController = __decorate([
    (0, swagger_1.ApiTags)('GET/mainOperationExample'),
    (0, common_1.Controller)('GET/mainOperationExample'),
    (0, common_1.UseInterceptors)(apm_interceptor_1.ApmInterceptor),
    __metadata("design:paramtypes", [restExample_service_1.NewContractService,
        processTime_service_1.ProcessTimeService,
        logger_service_1.AppLoggerService])
], MainExampleController);
//# sourceMappingURL=main-example.controller.js.map