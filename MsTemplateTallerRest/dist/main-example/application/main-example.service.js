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
exports.MainExampleService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const env_config_1 = require("../../share/domain/resources/env.config");
const business_exceptions_1 = require("../../share/domain/config/business-exceptions");
const apiResponse_dto_1 = require("../../share/domain/dto/apiResponse.dto");
const constants_1 = require("../../share/domain/resources/constants");
const logger_service_1 = require("../../share/domain/config/logger.service");
let MainExampleService = class MainExampleService {
    constructor(logger, configService) {
        this.logger = logger;
        this.configService = configService;
    }
    async consultExecOperationExample(mainExampleRequest, processTime) {
        try {
            return new apiResponse_dto_1.ApiResponseDto(common_1.HttpStatus.OK, 'Proceso ejecutado correctamente', {}, this.transactionId);
        }
        catch (error) {
            this.logger.error(error.message, error.stack, __dirname, this.consultExecOperationExample.name, processTime.end(), this.transactionId);
            throw new business_exceptions_1.BusinessException(common_1.HttpStatus.INTERNAL_SERVER_ERROR, constants_1.MSG_500, false, {
                codMessage: error.message,
                context: 'procedimientoActivacion',
            });
        }
    }
    getGroupsFromDto(dtoClass, dtoInstance) {
        const metadataStorage = (0, class_validator_1.getMetadataStorage)();
        const validations = metadataStorage.getTargetValidationMetadatas(dtoClass, '', false, false);
        const groups = validations
            .filter((meta) => meta.groups && meta.groups.length > 0)
            .filter((meta) => dtoInstance.hasOwnProperty(meta.propertyName))
            .flatMap((meta) => meta.groups || []);
        return Array.from(new Set(groups));
    }
};
exports.MainExampleService = MainExampleService;
__decorate([
    (0, common_1.Inject)('TransactionId'),
    __metadata("design:type", String)
], MainExampleService.prototype, "transactionId", void 0);
exports.MainExampleService = MainExampleService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(1, (0, common_1.Inject)(env_config_1.default.KEY)),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService, void 0])
], MainExampleService);
//# sourceMappingURL=main-example.service.js.map