import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import config from '../resources/env.config';
export declare class TimeOutInterceptor implements NestInterceptor {
    private moduleRef;
    private configService;
    private readonly logger;
    constructor(moduleRef: ModuleRef, configService: ConfigType<typeof config>);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>>;
}
