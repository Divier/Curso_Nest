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
var TimeOutInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOutInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const env_config_1 = require("../resources/env.config");
let TimeOutInterceptor = TimeOutInterceptor_1 = class TimeOutInterceptor {
    constructor(moduleRef, configService) {
        this.moduleRef = moduleRef;
        this.configService = configService;
        this.logger = new common_1.Logger(TimeOutInterceptor_1.name);
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.timeout)(this.configService.TIMEOUT), (0, operators_1.catchError)((err) => {
            if (err instanceof rxjs_1.TimeoutError)
                return (0, rxjs_1.throwError)(() => {
                    const request = context.switchToHttp().getRequest();
                    const contextId = core_1.ContextIdFactory.getByRequest(request);
                    this.moduleRef
                        .resolve('TransactionId', contextId)
                        .then((transactionId) => {
                        this.logger.error('La operacion ha alcanzado el tiempo maximo de espera', {
                            statusCode: common_1.HttpStatus.GATEWAY_TIMEOUT,
                            transactionId,
                        });
                    });
                    return new common_1.GatewayTimeoutException();
                });
            throw err;
        }));
    }
};
exports.TimeOutInterceptor = TimeOutInterceptor;
exports.TimeOutInterceptor = TimeOutInterceptor = TimeOutInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(env_config_1.default.KEY)),
    __metadata("design:paramtypes", [core_1.ModuleRef, void 0])
], TimeOutInterceptor);
//# sourceMappingURL=timeout.interceptors.js.map