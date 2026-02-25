"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainExampleModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const env_config_1 = require("../share/domain/resources/env.config");
const logger_service_1 = require("../share/domain/config/logger.service");
const main_example_controller_1 = require("./controller/main-example.controller");
const main_example_service_1 = require("./application/main-example.service");
const restExample_service_1 = require("./application/restExample.service");
const provider_service_impl_1 = require("./infrastructure/infrastructure/rest/impl/provider.service.impl");
let MainExampleModule = class MainExampleModule {
};
exports.MainExampleModule = MainExampleModule;
exports.MainExampleModule = MainExampleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [env_config_1.default],
            }),
        ],
        controllers: [main_example_controller_1.MainExampleController],
        providers: [main_example_service_1.MainExampleService, logger_service_1.AppLoggerService, restExample_service_1.NewContractService, provider_service_impl_1.ProviderService],
    })
], MainExampleModule);
//# sourceMappingURL=main-example.module.js.map