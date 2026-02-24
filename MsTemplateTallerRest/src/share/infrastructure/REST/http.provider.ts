import { Injectable } from '@nestjs/common';
import { Etask } from '../../domain/resources/constants';
import { ApiResponseDto } from '../../domain/dto/apiResponse.dto';
import { IRequestConfigHttp } from '../../domain/config/request-config-http.models';

/**
 * Clase abstracta generica para realizar consumos a legados de tipo Rest
 * @author Edwin Avila
 */
@Injectable()
export abstract class IHttpProvider {
   /**
    * Operación para realizar un consumo a legado de tipo Rest
    * @param {IRequestConfigHttp} _requestConfig arreglo con información del legado a consumir
    * @param {Etask} _task nombre identificador de la tarea donde se realiza el consumo
    */
  abstract executeRest<R = any>(
    _requestConfig: IRequestConfigHttp,
    _task?: Etask | string
  ): Promise<ApiResponseDto>;
}
