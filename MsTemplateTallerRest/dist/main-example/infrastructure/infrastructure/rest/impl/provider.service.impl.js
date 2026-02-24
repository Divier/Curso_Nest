"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const common_1 = require("@nestjs/common");
const http_provider_impl_1 = require("../../../../../share/infrastructure/REST/impl/http.provider.impl");
const constants_1 = require("../../../../../share/domain/resources/constants");
let ProviderService = class ProviderService extends http_provider_impl_1.HttpUndiciProvider {
    async executeRestImpl(_requestConfig, _task) {
        return this.executeRest(_requestConfig, constants_1.Etask.CONSUMO_SERVICIO_REST);
    }
};
exports.ProviderService = ProviderService;
exports.ProviderService = ProviderService = __decorate([
    (0, common_1.Injectable)()
], ProviderService);
//# sourceMappingURL=provider.service.impl.js.map