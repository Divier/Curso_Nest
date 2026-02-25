import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../share/domain/resources/env.config';
import { AppLoggerService } from '../share/domain/config/logger.service';
import { MainExampleController } from './controller/main-example.controller';
import { MainExampleService } from './application/main-example.service';
import { NewContractService } from './application/restExample.service';
import { ProviderService } from './infrastructure/infrastructure/rest/impl/provider.service.impl';

/**
 *  @description clase anotada con un decorador @Module(). El decorador @Module() proporciona
 *  metadatos que Nest utiliza para organizar la estructura de la aplicación.
 *
 *  @author Fabrica Digital
 *
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [MainExampleController],
  providers: [MainExampleService, AppLoggerService, NewContractService, ProviderService],
})
export class MainExampleModule {}
