"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalModule = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const apm_service_1 = require("./config/apm.service");
const apm_interceptor_1 = require("./config/apm.interceptor");
const processTime_service_1 = require("./config/processTime.service");
const timeout_interceptors_1 = require("./config/timeout.interceptors");
const transactionId_provider_1 = require("./config/transactionId.provider");
const exceptions_manager_filter_1 = require("./config/exceptions-manager.filter");
let GlobalModule = class GlobalModule {
};
exports.GlobalModule = GlobalModule;
exports.GlobalModule = GlobalModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            transactionId_provider_1.TransaccionIdProvider,
            processTime_service_1.ProcessTimeService,
            apm_service_1.ApmService,
            {
                provide: core_1.APP_FILTER,
                useClass: exceptions_manager_filter_1.ExceptionManager,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                scope: common_1.Scope.DEFAULT,
                useClass: apm_interceptor_1.ApmInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                scope: common_1.Scope.DEFAULT,
                useClass: timeout_interceptors_1.TimeOutInterceptor,
            },
        ],
        exports: ['TransactionId', apm_service_1.ApmService, processTime_service_1.ProcessTimeService],
    })
], GlobalModule);
//# sourceMappingURL=global.module.js.map