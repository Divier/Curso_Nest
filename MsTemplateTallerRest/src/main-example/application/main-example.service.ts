import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { BusinessException } from '../../share/domain/config/business-exceptions';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';

import { Etask, MSG_500 } from '../../share/domain/resources/constants';

import { AppLoggerService } from '../../share/domain/config/logger.service';
import { ProviderService } from '../infrastructure/infrastructure/rest/impl/provider.service.impl';
import { IRequestConfigHttp } from 'src/share/domain/config/request-config-http.models';

/**
 *  @description Clase servicio responsable recibir el parametro y realizar la logica de negocio.
 *  @author Celula Azure
 */
@Injectable({ scope: Scope.REQUEST })
export class MainExampleService {
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly logger: AppLoggerService,
    private readonly providerService: ProviderService,
  ) {}

  /**
   * procedimientoActivacion
   * @description Metodo que permite ejecutar la logica de negocio
   * @param request Request MS
   * @param processTime Tiempo de procesamiento
   * @returns ApiResponseDto
   */
  public async consultExecOperationExample(
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
        this.consultExecOperationExample.name,
        processTime.end(),
        this.transactionId,
      );
      throw new BusinessException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MSG_500,
        false,
        {
          codMessage: error.message,
          context: 'consultExecOperationExample',
        },
      );
    }
  }
}
