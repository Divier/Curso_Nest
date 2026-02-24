"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpProviderModule = void 0;
const common_1 = require("@nestjs/common");
const http_provider_1 = require("./http.provider");
const http_provider_impl_1 = require("./impl/http.provider.impl");
const logger_service_1 = require("./../../domain/config/logger.service");
let HttpProviderModule = class HttpProviderModule {
};
exports.HttpProviderModule = HttpProviderModule;
exports.HttpProviderModule = HttpProviderModule = __decorate([
    (0, common_1.Module)({
        providers: [
            logger_service_1.AppLoggerService,
            {
                provide: http_provider_1.IHttpProvider,
                useClass: http_provider_impl_1.HttpUndiciProvider,
            },
        ],
        exports: [http_provider_1.IHttpProvider],
    })
], HttpProviderModule);
//# sourceMappingURL=http.provider.module.js.map