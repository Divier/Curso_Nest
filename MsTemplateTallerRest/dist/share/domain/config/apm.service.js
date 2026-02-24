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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApmService = void 0;
require("dotenv/config");
const env = (k) => { var _a, _b; return (_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a[k]) !== null && _b !== void 0 ? _b : ''; };
const common_1 = require("@nestjs/common");
const apm = require("elastic-apm-node");
const constants_1 = require("./../resources/constants");
let ApmService = class ApmService {
    constructor() {
        if (!apm.isStarted()) {
            apm.start({
                serviceName: constants_1.SERVICE_NAME,
                captureBody: 'all',
                environment: env('ELASTIC_APM_ENVIRONMENT'),
                serverUrl: env('ELASTIC_APM_SERVER_URL'),
                secretToken: '',
                errorOnAbortedRequests: false,
                stackTraceLimit: 500,
                frameworkName: 'fastify',
            });
        }
    }
    isStarted() {
        return apm.isStarted();
    }
    captureError(data) {
        apm.captureError(data);
    }
    startTransaction(name) {
        return apm.startTransaction(name);
    }
    setTransactionName(name) {
        return apm.setTransactionName(name);
    }
    endTransaction() {
        apm.endTransaction();
    }
    startSpan(name, type, subtype, action) {
        return apm.startSpan(name, type, subtype, action);
    }
    getCurrentTransaction() {
        try {
            if (this.isStarted()) {
                return apm.currentTransaction;
            }
            return null;
        }
        catch (error) {
            console.error('Error getting current transaction:', error);
            return null;
        }
    }
};
exports.ApmService = ApmService;
exports.ApmService = ApmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ApmService);
//# sourceMappingURL=apm.service.js.map