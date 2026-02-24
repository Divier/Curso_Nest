"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransaccionIdProvider = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
exports.TransaccionIdProvider = {
    provide: 'TransactionId',
    useFactory: () => (0, uuid_1.v4)(),
    scope: common_1.Scope.REQUEST,
};
//# sourceMappingURL=transactionId.provider.js.map