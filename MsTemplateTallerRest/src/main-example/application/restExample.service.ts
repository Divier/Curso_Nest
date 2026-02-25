import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { getMetadataStorage } from 'class-validator';
import config from '../../share/domain/resources/env.config';
import { BusinessException } from '../../share/domain/config/business-exceptions';
//import { IProviderService } from '../infrastructure/rest/provider.service';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import {
  EHttpMethod,
  IRequestConfigHttp,
} from '../../share/domain/config/request-config-http.models';
import { NewContractRequest } from '../domain/dto/restExample.request.dto';
import {
  ERROR,
  ERROR_TIMEOUT,
  Etask,
  MSG_500,
  MSG_503,
  MSG_504,
  MSG_EMPATY_FILTERS,
  MSG_LEGACY_503,
  MSG_LEGACY_504,
  OK,
} from '../../share/domain/resources/constants';
import { ResponseLegacy } from '../domain/dto/restExample.response.dto';
import { AppLoggerService } from '../../share/domain/config/logger.service';
import { IProviderService } from '../infrastructure/infrastructure/rest/provider.service';
import { ProviderService } from '../infrastructure/infrastructure/rest/impl/provider.service.impl';

/**
 *  @description Clase servicio responsable recibir el parametro y realizar la logica de negocio.
 *  @author Celula Azure
 */
@Injectable({ scope: Scope.REQUEST })
export class NewContractService {
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly providerService: ProviderService,
    private readonly logger: AppLoggerService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  /**
   * procedimientoActivacion
   * @description Metodo que permite ejecutar la logica de negocio
   * @param newContractRequest Request MS
   * @param channel Header channel MS
   * @returns ApiResponseDto
   */
  public async procedimientoActivacion(
    newContractRequest: NewContractRequest,
    channel: string,
    processTime: any,
  ): Promise<ApiResponseDto> {
    try {
      const requestLegacy: IRequestConfigHttp = this.createRequestHttpRest(
        newContractRequest,
        channel,
      );

      const responseLegacy: ApiResponseDto = await this.restService(
        requestLegacy,
        processTime,
      );

      return this.handleResponseLegacy(responseLegacy);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        __dirname,
        this.procedimientoActivacion.name,
        processTime.end(),
        this.transactionId,
      );
      throw new BusinessException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MSG_500,
        false,
        {
          codMessage: error.message,
          context: 'procedimientoActivacion',
        },
      );
    }
  }

  /**
   * restService
   * @description Resliza el consumo HTTP del Legado
   * @param request IRequestConfigHttp
   * @returns ApiResponseDto
   */
  public async restService(
    request: IRequestConfigHttp,
    processTime: any,
  ): Promise<ApiResponseDto> {
    try {
      return await this.providerService.executeRest(
        request,
        Etask.CONSUMO_SERVICIO_REST,
      );
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        __dirname,
        this.procedimientoActivacion.name,
        processTime.end(),
        this.transactionId,
      );
      throw new BusinessException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MSG_500,
        false,
        {
          codMessage: error.message,
          context: 'restService',
        },
      );
    }
  }

  /**
   * createHeadersHttp
   * @description Crear el objecto headers para la peticion HTTP
   * @param channel Propiedad
   * @returns Object headers
   */
  public createHeadersHttp(channel?: string) {
    return channel ? { channel: channel } : {};
  }

  /**
   * createRequestHttp
   * @description Crear el objecto request para la peticion HTTP
   * @param newContractRequest Request MS
   * @param channel Header channel MS
   * @returns IRequestConfigHttp
   */
  public createRequestHttpRest(
    newContractRequest: NewContractRequest,
    channel: string,
  ): IRequestConfigHttp {
    return {
      method: EHttpMethod.get,
      url: this.configService.REST.URL,
      headers: { ...this.createHeadersHttp(channel) },
      params: { ...newContractRequest },
      timeout: this.configService.REST.TIMEOUT,
      headersTimeout: this.configService.REST.HEADERS_TIMEOUT,
    };
  }

  /**
   * handleResponseLegacy
   * @description Maneja la respuesta del legado REST
   * @param response Respuesta del legado REST
   * @returns ApiResponseDto
   */
  public handleResponseLegacy(response: ApiResponseDto): ApiResponseDto {
    let responseLegacy: ResponseLegacy;
    if (
      response.responseCode === undefined &&
      response.data?.code === ERROR_TIMEOUT
    ) {
      responseLegacy = {
        billing: {
          responseStatus: {
            code: HttpStatus.GATEWAY_TIMEOUT.toString(),
            message: MSG_LEGACY_504,
            status: ERROR,
          },
        },
      };
      return new ApiResponseDto(
        HttpStatus.GATEWAY_TIMEOUT,
        MSG_504,
        { ...responseLegacy },
        response.transactionId,
      );
    }
    if (response.responseCode === HttpStatus.SERVICE_UNAVAILABLE) {
      responseLegacy = {
        billing: {
          responseStatus: {
            code: HttpStatus.SERVICE_UNAVAILABLE.toString(),
            message: MSG_LEGACY_503,
            status: ERROR,
          },
        },
      };
      response.data = { ...responseLegacy };
      response.message = MSG_503;
      return response;
    }
    if (response.responseCode === HttpStatus.OK) {
      response.message = OK;
      response.data = { ...response.data?.data };
      return response;
    }
    return response;
  }
}
