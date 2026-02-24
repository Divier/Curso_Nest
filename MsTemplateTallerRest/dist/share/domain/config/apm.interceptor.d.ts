import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApmService } from './apm.service';
export declare class ApmInterceptor implements NestInterceptor {
    private readonly apmService;
    constructor(apmService: ApmService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private tapLogical;
    private errorValidation;
}
