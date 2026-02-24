import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Global, Module, Scope } from '@nestjs/common';
import { ApmService } from './config/apm.service';
import { ApmInterceptor } from './config/apm.interceptor';
import { ProcessTimeService } from './config/processTime.service';
import { TimeOutInterceptor } from './config/timeout.interceptors';
import { TransaccionIdProvider } from './config/transactionId.provider';
import { ExceptionManager } from './config/exceptions-manager.filter';

/**
 *  @description clase anotada con un decorador @Module(). El decorador @Module() proporciona
 *  metadatos que Nest utiliza para organizar la estructura de la aplicación.
 *
 *  @author Fabrica Digital
 *
 */
@Global()
@Module({
  providers: [
    TransaccionIdProvider,
    ProcessTimeService,
    ApmService,
    {
      provide: APP_FILTER,
      useClass: ExceptionManager,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.DEFAULT,
      useClass: ApmInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.DEFAULT,
      useClass: TimeOutInterceptor,
    },
  ],
  exports: ['TransactionId', ApmService, ProcessTimeService],
})
export class GlobalModule {}
