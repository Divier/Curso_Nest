import 'dotenv/config';
import { ApmService } from './share/domain/config/apm.service';
const apmService = new ApmService();
if (apmService.isStarted()) console.log('APM started');
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compress from '@fastify/compress';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import configuration from './share/domain/resources/env.config';
import { AppLoggerService } from './share/domain/config/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  SERVICE_DESCRIPTION,
  SERVICE_NAME,
  SERVICE_PREFIX,
  SERVICE_VERSION,
} from './share/domain/resources/constants';

/**
 *  @description Archivo de entrada hacia la aplicación que utiliza la función central NestFactory
 *  para crear una instancia de la aplicación Nest.
 *
 *  @author Fabrica Digital
 *
 */
async function bootstrap() {
  //Pasa las opciones directamente al FastifyAdapter
  const adapter = new FastifyAdapter({
    keepAliveTimeout: 65000, // 65 segundos
    maxRequestsPerSocket: 100, // Reutiliza conexiones hasta 100 peticiones
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { logger: new AppLoggerService() },
  );

  // Registra el plugin de compresión
  await app.register(compress as any, {
    encodings: ['br'],
    global: true,
  });

  // Registra el plugin Helmet para seguridad
  const fastifyHelmetPlugin = require('@fastify/helmet');
  await app.register(fastifyHelmetPlugin, {
    global: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });

  //configuracion libreria para validacion de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  //Ruta global del servicio
  app.setGlobalPrefix(SERVICE_PREFIX);

  const configSwagger = new DocumentBuilder()
    .setTitle(SERVICE_NAME)
    .setDescription(SERVICE_DESCRIPTION)
    .setVersion(SERVICE_VERSION)
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, documentSwagger);

  await app.listen(app.get(configuration.KEY).PORT, '0.0.0.0');
  app.use(
    helmet({
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
      },
    }),
  );

  app
    .get(Logger)
    .log(`Application is running on: ${await app.getUrl()}`, 'Main');
}
bootstrap();
