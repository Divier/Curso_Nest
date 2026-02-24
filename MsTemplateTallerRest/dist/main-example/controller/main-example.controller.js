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
const main_example_service_1 = require("../application/main-example.service");
const main_example_request_dto_1 = require("../domain/dto/main-example.request.dto");
let MainExampleController = class MainExampleController {
    constructor(service, processTimeService, logger) {
        this.service = service;
        this.processTimeService = processTimeService;
        this.logger = logger;
    }
    async restExampleController(res, payload) {
        const processTime = this.processTimeService.start();
        let serviceResponse;
        try {
            this.logger.log('Iniciando procesamiento de información', `${this.restExampleController.name}`, processTime.end(), this.transactionId, JSON.stringify(payload));
            serviceResponse = await this.service.consultExecOperationExample(payload, processTime);
            res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            res.status(serviceResponse.responseCode).send(serviceResponse);
        }
        finally {
            this.logger.log('Procesamiento finalizado', `${this.restExampleController.name}`, processTime.end(), this.transactionId, JSON.stringify(payload), JSON.stringify(serviceResponse));
        }
    }
};
exports.MainExampleController = MainExampleController;
__decorate([
    (0, common_1.Inject)('TransactionId'),
    __metadata("design:type", String)
], MainExampleController.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiHeader)({
        name: 'Channel',
        required: false,
        description: 'Canal que realiza la solicitud',
    }),
    (0, swagger_1.ApiResponse)({
        type: apiResponse_dto_1.ApiResponseDto,
        status: 200,
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, main_example_request_dto_1.MainExampleRequest]),
    __metadata("design:returntype", Promise)
], MainExampleController.prototype, "restExampleController", null);
exports.MainExampleController = MainExampleController = __decorate([
    (0, swagger_1.ApiTags)('GET/mainOperationExample'),
    (0, common_1.Controller)('GET/mainOperationExample'),
    (0, common_1.UseInterceptors)(apm_interceptor_1.ApmInterceptor),
    __metadata("design:paramtypes", [main_example_service_1.MainExampleService,
        processTime_service_1.ProcessTimeService,
        logger_service_1.AppLoggerService])
], MainExampleController);
//# sourceMappingURL=main-example.controller.js.map