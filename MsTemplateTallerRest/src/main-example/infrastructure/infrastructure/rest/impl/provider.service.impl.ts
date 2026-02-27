
import { Injectable } from "@nestjs/common";
import { HttpUndiciProvider } from "../../../../../share/infrastructure/REST/impl/http.provider.impl";
import { IProviderService } from "../provider.service";
import { IRequestConfigHttp } from "../../../../../share/domain/config/request-config-http.models";
import { Etask } from "../../../../../share/domain/resources/constants";

/**
 * Clase generica para realizar consumos a legados Rest
 * @author Edwin Avila
 */
@Injectable()
export class ProviderService extends HttpUndiciProvider implements IProviderService {
    async executeRestImpl<R = any>(_requestConfig: IRequestConfigHttp, _task?: any): Promise<any> {
       return this.executeRest(_requestConfig, Etask.CONSUMO_SERVICIO_REST);
    }
}