import { Module } from '@nestjs/common';
import { IHttpProvider } from './http.provider';
import { HttpUndiciProvider } from './impl/http.provider.impl';
import { AppLoggerService } from './../../domain/config/logger.service';

/**
 * Clase encargada de definir los componentes para el consumo rest
 */
@Module({
  providers: [
    AppLoggerService,
    {
      provide: IHttpProvider,
      useClass: HttpUndiciProvider,
    },
  ],
  exports: [IHttpProvider],
})
export class HttpProviderModule {}
