"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORACLE_POOL_STATISTICS = exports.MSG_500 = exports.MSG_503 = exports.MSG_LEGACY_503 = exports.ERROR_TIMEOUT = exports.MSG_502 = exports.MSG_LEGACY_502 = exports.MSG_504 = exports.MSG_LEGACY_504 = exports.MSG_EMPATY_FILTERS = exports.ERROR = exports.EmessageMapping = exports.Etask = exports.OK = exports.SERVICE_PREFIX = exports.SERVICE_DESCRIPTION = exports.SERVICE_VERSION = exports.SERVICE_NAME = void 0;
exports.SERVICE_NAME = 'ArchitypeNestJS';
exports.SERVICE_VERSION = '1.0';
exports.SERVICE_DESCRIPTION = 'Plantilla para servicios ORACLE y REST basados en NestJS';
exports.SERVICE_PREFIX = `MS/CUS/CustomerBill/RSCuAcBalPartialDetail/V1/GET/partialBalance`;
exports.OK = 'OK';
var Etask;
(function (Etask) {
    Etask["CONSUMO_SERVICIO_REST"] = "CONSUMO_SERVICIO_REST";
    Etask["CHANNEL_ERROR"] = "Consumiendo servicio";
    Etask["EXCEPTION_MANAGER"] = "EXCEPTION_MANAGER";
})(Etask || (exports.Etask = Etask = {}));
var EmessageMapping;
(function (EmessageMapping) {
    EmessageMapping["CAMPOS_OBLIGATORIOS"] = "CAMPOS_OBLIGATORIOS";
    EmessageMapping["CHANNEL_ERROR"] = "CHANNEL_ERROR";
    EmessageMapping["DEFAULT_ERROR"] = "DEFAULT_ERROR";
})(EmessageMapping || (exports.EmessageMapping = EmessageMapping = {}));
exports.ERROR = 'Error';
exports.MSG_EMPATY_FILTERS = "Debe proporcionar al menos uno de los siguientes filtros: 'subscriberNumber', 'accountNumber' o 'financialDocID'.";
exports.MSG_LEGACY_504 = 'El servidor no recibió una respuesta a tiempo de un servicio externo';
exports.MSG_504 = 'Gateway Timeout';
exports.MSG_LEGACY_502 = 'El servidor recibió una respuesta inválida de un sistema intermedio o externo';
exports.MSG_502 = 'API Gateway con error';
exports.ERROR_TIMEOUT = 'UND_ERR_HEADERS_TIMEOUT';
exports.MSG_LEGACY_503 = 'El servicio no está disponible temporalmente. Intente nuevamente más tarde';
exports.MSG_503 = 'Servidor Sobrecargado';
exports.MSG_500 = 'fallo inesperado';
var ORACLE_POOL_STATISTICS;
(function (ORACLE_POOL_STATISTICS) {
    ORACLE_POOL_STATISTICS["DB_POOL_STATISTICS_TIME_INTERVAL"] = "60000";
    ORACLE_POOL_STATISTICS["DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY"] = "1";
    ORACLE_POOL_STATISTICS["DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY_TIME"] = "30000";
    ORACLE_POOL_STATISTICS["DB_POOL_ENABLE_STATISTICS"] = "0";
})(ORACLE_POOL_STATISTICS || (exports.ORACLE_POOL_STATISTICS = ORACLE_POOL_STATISTICS = {}));
//# sourceMappingURL=constants.js.map