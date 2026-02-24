import { registerAs } from '@nestjs/config';

/**
 *  @description En las aplicaciones de Node.js, es común usar archivos .env, que contienen pares
 *  clave-valor donde cada clave representa un valor particular, para representar cada entorno.
 *  Ejecutar una aplicación en diferentes entornos es solo una cuestión de intercambiar el
 *  archivo .env correcto.
 *
 *  @author Celula Azure
 *
 */
export default registerAs('configuration', () => ({
  PORT: process.env.PORT,
  TIMEOUT: parseInt(process.env.TIMEOUT),
  APM: {
    HOST: process.env.ELASTIC_APM_SERVER_URL,
    ENVIRONMENT: process.env.ELASTIC_APM_ENVIRONMENT,
    ISACTIVE: process.env.ELASTIC_APM_ACTIVE,
  },
  REST: {
    URL: process.env.HTTP_URL,
    TIMEOUT: parseInt(process.env.HTTP_TIMEOUT),
    HEADERS_TIMEOUT: parseInt(process.env.HTTP_HEADERS_TIMEOUT),
  },  ORACLE: {
    LEGACY_DB_CONNECT_STRING: process.env.LEGACY_DB_CONNECT_STRING,
    LEGACY_DB_VAR1: process.env.LEGACY_DB_VAR1,
    LEGACY_DB_VAR2: process.env.LEGACY_DB_VAR2,
    LEGACY_DB_POOL_MAX: process.env.LEGACY_DB_POOL_MAX,
    LEGACY_DB_POOL_MIN: process.env.LEGACY_DB_POOL_MIN,
    LEGACY_DB_PL: process.env.LEGACY_DB_PL,
    LEGACY_DB_ALIAS: process.env.LEGACY_DB_ALIAS,
  },}));


