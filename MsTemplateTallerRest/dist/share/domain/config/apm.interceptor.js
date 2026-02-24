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
exports.ApmInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const apm_service_1 = require("./apm.service");
let ApmInterceptor = class ApmInterceptor {
    constructor(apmService) {
        this.apmService = apmService;
    }
    intercept(context, next) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const transactionName = `${method} ${url}`;
        let transaction;
        const currentTransaction = (_b = (_a = this.apmService).getCurrentTransaction) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (currentTransaction) {
            if (currentTransaction.name === 'unnamed' ||
                currentTransaction.name === 'unknown' ||
                currentTransaction.name.includes('unknown')) {
                this.apmService.setTransactionName(transactionName);
            }
            transaction = currentTransaction;
        }
        else {
            transaction = this.apmService.startTransaction(transactionName);
        }
        const spans = [];
        if (transaction) {
            transaction.setType('request');
            transaction.setLabel('method', method);
            transaction.setLabel('url', url);
        }
        return next.handle().pipe((0, operators_1.tap)((response) => {
            this.tapLogical(transaction, transactionName, response, spans);
        }), (0, operators_1.catchError)((error) => {
            this.errorValidation(transaction, error, transactionName, spans);
            throw error;
        }));
    }
    tapLogical(transaction, transactionName, response, spans) {
        if (transaction) {
            if (transaction.name === 'unknown' || !transaction.name) {
                this.apmService.setTransactionName(transactionName);
            }
            const responseSpan = this.apmService.startSpan('response_processing', 'app', 'response', '');
            if (responseSpan) {
                responseSpan.setLabel('status', 'success');
                responseSpan.setLabel('response_type', typeof response);
                spans.push(responseSpan);
            }
            spans.forEach((span) => {
                if (span)
                    span.end();
            });
            transaction.result = 'success';
            transaction.end();
        }
    }
    errorValidation(transaction, error, transactionName, spans) {
        if (transaction) {
            if (transaction.name === 'unknown' || !transaction.name) {
                this.apmService.setTransactionName(transactionName);
            }
            const errorSpan = this.apmService.startSpan('error_handling', 'app', 'error', '');
            if (errorSpan) {
                errorSpan.setLabel('error_type', error.name);
                errorSpan.setLabel('error_message', error.message);
                spans.push(errorSpan);
            }
            spans.forEach((span) => {
                if (span)
                    span.end();
            });
            transaction.end();
        }
    }
};
exports.ApmInterceptor = ApmInterceptor;
exports.ApmInterceptor = ApmInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [apm_service_1.ApmService])
], ApmInterceptor);
//# sourceMappingURL=apm.interceptor.js.map