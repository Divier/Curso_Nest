export declare const SERVICE_NAME = "ArchitypeNestJS";
export declare const SERVICE_VERSION = "1.0";
export declare const SERVICE_DESCRIPTION = "Plantilla para servicios ORACLE y REST basados en NestJS";
export declare const SERVICE_PREFIX = "MS/CUS/CustomerBill/RSCuAcBalPartialDetail/V1/GET/partialBalance";
export declare const OK = "OK";
export declare enum Etask {
    CONSUMO_SERVICIO_REST = "CONSUMO_SERVICIO_REST",
    CHANNEL_ERROR = "Consumiendo servicio",
    EXCEPTION_MANAGER = "EXCEPTION_MANAGER"
}
export declare enum EmessageMapping {
    CAMPOS_OBLIGATORIOS = "CAMPOS_OBLIGATORIOS",
    CHANNEL_ERROR = "CHANNEL_ERROR",
    DEFAULT_ERROR = "DEFAULT_ERROR"
}
export declare const enum TYPE_SEARCH {
    TYPE_SEARCH_SUBSCRIBERNUMBER = "1",
    TYPE_SEARCH_ACCOUNTNUMBER = "2",
    TYPE_SEARCH_PAYMENTREFERENCE = "3"
}
export declare const ERROR = "Error";
export declare const MSG_EMPATY_FILTERS = "Debe proporcionar al menos uno de los siguientes filtros: 'subscriberNumber', 'accountNumber' o 'financialDocID'.";
export declare const MSG_LEGACY_504 = "El servidor no recibi\u00F3 una respuesta a tiempo de un servicio externo";
export declare const MSG_504 = "Gateway Timeout";
export declare const MSG_LEGACY_502 = "El servidor recibi\u00F3 una respuesta inv\u00E1lida de un sistema intermedio o externo";
export declare const MSG_502 = "API Gateway con error";
export declare const ERROR_TIMEOUT = "UND_ERR_HEADERS_TIMEOUT";
export declare const MSG_LEGACY_503 = "El servicio no est\u00E1 disponible temporalmente. Intente nuevamente m\u00E1s tarde";
export declare const MSG_503 = "Servidor Sobrecargado";
export declare const MSG_500 = "fallo inesperado";
export declare enum ORACLE_POOL_STATISTICS {
    DB_POOL_STATISTICS_TIME_INTERVAL = "60000",
    DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY = "1",
    DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY_TIME = "30000",
    DB_POOL_ENABLE_STATISTICS = "0"
}
