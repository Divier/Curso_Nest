/**
 *  @description Archivo constants.ts encargado de exportar constantes de forma general.
 *
 *  @author Celula Azure
 *
 */
export const SERVICE_NAME = 'ArchitypeNestJS';
export const SERVICE_VERSION = '1.0';
export const SERVICE_DESCRIPTION =
  'Plantilla para servicios ORACLE y REST basados en NestJS';
export const SERVICE_PREFIX = `MS/CUS/CustomerBill/RSCuAcBalPartialDetail/V1/GET/partialBalance`;
export const OK = 'OK';

export enum Etask {
  CONSUMO_SERVICIO_REST = 'CONSUMO_SERVICIO_REST',
  CHANNEL_ERROR = 'Consumiendo servicio',
  EXCEPTION_MANAGER = 'EXCEPTION_MANAGER',
}

export enum EmessageMapping {
  CAMPOS_OBLIGATORIOS = 'CAMPOS_OBLIGATORIOS',
  CHANNEL_ERROR = 'CHANNEL_ERROR',
  DEFAULT_ERROR = 'DEFAULT_ERROR',
}

export const enum TYPE_SEARCH {
  TYPE_SEARCH_SUBSCRIBERNUMBER = '1',
  TYPE_SEARCH_ACCOUNTNUMBER = '2',
  TYPE_SEARCH_PAYMENTREFERENCE = '3',
}

export const ERROR = 'Error';
export const MSG_EMPATY_FILTERS =
  "Debe proporcionar al menos uno de los siguientes filtros: 'subscriberNumber', 'accountNumber' o 'financialDocID'.";
export const MSG_LEGACY_504 =
  'El servidor no recibió una respuesta a tiempo de un servicio externo';
export const MSG_504 = 'Gateway Timeout';
export const MSG_LEGACY_502 =
  'El servidor recibió una respuesta inválida de un sistema intermedio o externo';
export const MSG_502 = 'API Gateway con error';
export const ERROR_TIMEOUT = 'UND_ERR_HEADERS_TIMEOUT';
export const MSG_LEGACY_503 =
  'El servicio no está disponible temporalmente. Intente nuevamente más tarde';
export const MSG_503 = 'Servidor Sobrecargado';
export const MSG_500 = 'fallo inesperado';
export enum ORACLE_POOL_STATISTICS {
  DB_POOL_STATISTICS_TIME_INTERVAL = '60000',
  DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY = '1',
  DB_POOL_STATISTICS_SLEEP_FOR_INACTIVITY_TIME = '30000',
  DB_POOL_ENABLE_STATISTICS = '0', //Se debe poner en 1 para activar las estadisticas del pool
}
