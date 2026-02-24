declare const _default: (() => {
    PORT: string;
    TIMEOUT: number;
    APM: {
        HOST: string;
        ENVIRONMENT: string;
        ISACTIVE: string;
    };
    REST: {
        URL: string;
        TIMEOUT: number;
        HEADERS_TIMEOUT: number;
    };
    ORACLE: {
        LEGACY_DB_CONNECT_STRING: string;
        LEGACY_DB_VAR1: string;
        LEGACY_DB_VAR2: string;
        LEGACY_DB_POOL_MAX: string;
        LEGACY_DB_POOL_MIN: string;
        LEGACY_DB_PL: string;
        LEGACY_DB_ALIAS: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    PORT: string;
    TIMEOUT: number;
    APM: {
        HOST: string;
        ENVIRONMENT: string;
        ISACTIVE: string;
    };
    REST: {
        URL: string;
        TIMEOUT: number;
        HEADERS_TIMEOUT: number;
    };
    ORACLE: {
        LEGACY_DB_CONNECT_STRING: string;
        LEGACY_DB_VAR1: string;
        LEGACY_DB_VAR2: string;
        LEGACY_DB_POOL_MAX: string;
        LEGACY_DB_POOL_MIN: string;
        LEGACY_DB_PL: string;
        LEGACY_DB_ALIAS: string;
    };
}>;
export default _default;
