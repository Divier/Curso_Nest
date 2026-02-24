import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApmService } from './apm.service';

/**
 *  @description Clase que intercepta las peticiones Http con el fin de enviar detalle de los errores a APM
 *
 *  @author Fabrica Microservicios
 *  @date Julio 2022
 *
 */
@Injectable()
export class ApmInterceptor implements NestInterceptor {
  constructor(private readonly apmService: ApmService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const transactionName = `${method} ${url}`;

    let transaction;
    const currentTransaction = this.apmService.getCurrentTransaction?.();

    if (currentTransaction) {
      if (
        currentTransaction.name === 'unnamed' ||
        currentTransaction.name === 'unknown' ||
        currentTransaction.name.includes('unknown')
      ) {
        this.apmService.setTransactionName(transactionName);
      }

      transaction = currentTransaction;
    } else {
      transaction = this.apmService.startTransaction(transactionName);
    }

    const spans: any[] = [];

    if (transaction) {
      transaction.setType('request');
      transaction.setLabel('method', method);
      transaction.setLabel('url', url);
    }

    return next.handle().pipe(
      tap((response) => {
        this.tapLogical(transaction, transactionName, response, spans)
      }),
      catchError((error) => {
        this.errorValidation(transaction, error, transactionName, spans);
        throw error;
      }),
    );
  }

  private tapLogical(transaction: any, transactionName: string, response: any, spans: any){
      if (transaction) {
          if (transaction.name === 'unknown' || !transaction.name) {
            this.apmService.setTransactionName(transactionName);
          }

          const responseSpan = this.apmService.startSpan(
            'response_processing',
            'app',
            'response',
            ''
          );
          if (responseSpan) {
            responseSpan.setLabel('status', 'success');
            responseSpan.setLabel('response_type', typeof response);
            spans.push(responseSpan);
          }

          spans.forEach((span) => {
            if (span) span.end();
          });

          transaction.result = 'success';
          transaction.end();
        }
  }

  private errorValidation(transaction: any, error: any, transactionName: string, spans: any){
    if (transaction) {
      if (transaction.name === 'unknown' || !transaction.name) {
        this.apmService.setTransactionName(transactionName);
      }

      const errorSpan = this.apmService.startSpan(
        'error_handling',
        'app',
        'error',
        ''
      );
      if (errorSpan) {
        errorSpan.setLabel('error_type', error.name);
        errorSpan.setLabel('error_message', error.message);
        spans.push(errorSpan);
      }

      spans.forEach((span: any) => {
        if (span) span.end();
      });

      transaction.end();
    }
  }
}
