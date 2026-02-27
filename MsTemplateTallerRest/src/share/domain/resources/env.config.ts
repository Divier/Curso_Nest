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
  SERVICE_NAME : process.env.SERVICE_NAME,
  APM: {
    HOST: process.env.ELASTIC_APM_SERVER_URL,
    ENVIRONMENT: process.env.ELASTIC_APM_ENVIRONMENT,
    ISACTIVE: process.env.ELASTIC_APM_ACTIVE,
  },
  REST: {
    URL: process.env.HTTP_URL,
    TIMEOUT: parseInt(process.env.HTTP_TIMEOUT),
    HEADERS_TIMEOUT: parseInt(process.env.HTTP_HEADERS_TIMEOUT),
  },
  LOG: {
    RESPONSE_TRUNCATED: process.env.RESPONSE_TRUNCATED,
    RESPONSE_TRUNCATE_LENGTH: process.env.RESPONSE_TRUNCATE_LENGTH
  },
  KAFKA: {
    URL: process.env.KAFKA_URL,
    BROKER_SSL: process.env.KAFKA_BROKER_SSL,
    TOPIC: process.env.KAFKA_TOPIC,
    CLIENT_ID: process.env.KAFKA_CLIENT_ID,
  }
}));
