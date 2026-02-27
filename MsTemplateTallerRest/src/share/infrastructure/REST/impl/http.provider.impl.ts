import { Inject, Injectable } from '@nestjs/common';
import { Agent, request } from 'undici';
import { ApmService } from '../../../domain/config/apm.service';
import { IHttpProvider } from '../http.provider';
import { ApiResponseDto } from '../../../domain/dto/apiResponse.dto';
import { Etask } from '../../../domain/resources/constants';
import { IRequestConfigHttp } from '../../../domain/config/request-config-http.models';
import { AppLoggerService } from './../../../domain/config/logger.service';
import { ProcessTimeService } from './../../../domain/config/processTime.service';
/**
 * Clase generica para realizar consumos a legados Rest
 * @author Edwin Avila
 */
@Injectable()
export class HttpUndiciProvider implements IHttpProvider {
  @Inject('TransactionId') private readonly transactionId: string;
  constructor(
    private readonly apmService: ApmService,
    private readonly logger: AppLoggerService,
    private readonly processTime: ProcessTimeService,
  ) {}

  /**
   * Operación para realizar un consumo a legados de tipo Rest
   * @param {IRequestConfigHttp} _requestConfig arreglo con información del legado a consumir
   * @param {Etask} _task nombre identificador de la tarea donde se realiza el consumo
   * @returns {ApiResponseDto} arreglo con información de respuesta del legado consumido
   */
  async executeRest<R = any>(
    _requestConfig: IRequestConfigHttp,
    _task?: Etask | string,
  ): Promise<ApiResponseDto> {
    let result: ApiResponseDto;
    let spanIn: any;
    let requestRest = { ..._requestConfig };
    const processT = this.processTime.start();
    try {
      spanIn = this.apmService.startSpan(
        HttpUndiciProvider.name,
        'Rest',
        'executeRest',
        'APM',
      );
      const httpResponse = await request(this.getUrl(_requestConfig), {
        method: _requestConfig.method,
        headers: _requestConfig?.headers || {
          'content-type': 'application/json',
        },
        body: this.getBody(_requestConfig.data),
        dispatcher: new Agent(await this.buildAgent(_requestConfig)),
        headersTimeout: requestRest.headersTimeout,
      });

      const data = await this.getData(httpResponse);
      result = new ApiResponseDto(
        httpResponse.statusCode,
        'Response Rest',
        data,
        this.transactionId,
      );
      this.logger.log(
        'Iniciando consumo rest',
        `${this.executeRest.name}-${this.getUrl(_requestConfig)}`,
        processT.end(),
        this.transactionId,
        JSON.stringify(_requestConfig),
        JSON.stringify(result),
      );
    } catch (error) {
      error['config'] = _requestConfig;
      result = new ApiResponseDto(
        error.statusCode,
        'Error response consumo rest',
        error,
        this.transactionId,
      );
    }
    if (spanIn) spanIn.end();
    this.logger.log(
      'Consumo rest finalizado',
      `${this.executeRest.name}-${this.getUrl(_requestConfig)}`,
      processT.end(),
      this.transactionId,
      JSON.stringify(_requestConfig),
      JSON.stringify(result),
    );
    return result;
  }

  /**
   * Gestiona la conversion de la data para una solicitud Http
   * @param {any} data Parámetros enviados a una solicitud Http
   * @returns {string | undefined}Si data se encuentra definido, devolvera un `string` de lo contrario `undefined`
   */
  private getBody(data: any): string | undefined {
    if (!data) return undefined;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') return JSON.stringify(data);
    return undefined;
  }

  /**
   * Crea la url de consulta de acuerdo a la configuración
   * @param {IRequestConfigHttp} requestConfig Objeto de configuración para solicitudes Http
   * @returns {string} Url de la petición
   */
  private getUrl(requestConfig: IRequestConfigHttp): string {
    if (!requestConfig.params) return requestConfig.url;
    return `${requestConfig.url}?${new URLSearchParams(requestConfig.params).toString()}`;
  }

  /**
   * Resulve la promesa de acuerdo al contenido de la respuesta.
   * @param response Objeto de respuesta entregado por Undici
   * @returns {any}
   */
  private async getData(response: any): Promise<any> {
    return response.headers['content-type'].includes('application/json')
      ? response.body.json()
      : response.body.text();
  }

  /**
   * Construye agente para cosumos https por medio de certificado
   * @param _requestConfig
   * @returns
   */
  private async buildAgent(
    _requestConfig: IRequestConfigHttp,
  ): Promise<object> {
    let agentResponse = { connectTimeout: _requestConfig.timeout };
    if (_requestConfig.cert && _requestConfig.key) {
      const keyData = _requestConfig.key.replace(/\\n/g, '\n');
      const crtData = _requestConfig.cert.replace(/\\n/g, '\n');
      agentResponse['connect'] = {
        cert: crtData,
        key: keyData,
      };
    } else {
      agentResponse['connect'] = {
        rejectUnauthorized: false,
      };
    }
    return agentResponse;
  }
}
