"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessException = void 0;
class BusinessException {
    constructor(code, description, success = false, details) {
        this.code = code;
        this.description = description;
        this.success = success;
        this.details = details;
    }
}
exports.BusinessException = BusinessException;
//# sourceMappingURL=business-exceptions.js.map