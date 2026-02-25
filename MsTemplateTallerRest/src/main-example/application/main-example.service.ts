import {
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { getMetadataStorage } from 'class-validator';
import config from '../../share/domain/resources/env.config';
import { BusinessException } from '../../share/domain/config/business-exceptions';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';

import {
  MSG_500,
} from '../../share/domain/resources/constants';

import { AppLoggerService } from '../../share/domain/config/logger.service';
import { MainExampleRequest } from '../domain/dto/main-example.request.dto';

/**
 *  @description Clase servicio responsable recibir el parametro y realizar la logica de negocio.
 *  @author Celula Azure
 */
@Injectable({ scope: Scope.REQUEST })
export class MainExampleService {
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly logger: AppLoggerService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  /**
   * procedimientoActivacion
   * @description Metodo que permite ejecutar la logica de negocio
   * @param mainExampleRequest Request MS
   * @param processTime Tiempo de procesamiento
   * @returns ApiResponseDto
   */
  public async consultExecOperationExample(
    mainExampleRequest: MainExampleRequest,
    processTime: any,
  ): Promise<ApiResponseDto> {

    try {
      /**
       * Logica de negocio y llamada a otros servicios
       *
       */
      return new ApiResponseDto(
        HttpStatus.OK,
        'Proceso ejecutado correctamente',
        {},
        this.transactionId,
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
          context: 'procedimientoActivacion',
        },
      );
    }
  }

  /**
   * getGroupsFromDto
   * @description Obtiene todos los grupos de validación activos en las propiedades de un DTO.
   * @param dtoClass dtoClass La clase del DTO decorada con class-validator.
   * @param dtoInstance Request del MS.
   * @returns string[]
   */
  public getGroupsFromDto(dtoClass: Function, dtoInstance: any): string[] {
    const metadataStorage = getMetadataStorage();
    const validations = metadataStorage.getTargetValidationMetadatas(
      dtoClass,
      '',
      false,
      false,
    );
    const groups = validations
      .filter((meta) => meta.groups && meta.groups.length > 0)
      .filter((meta) => dtoInstance.hasOwnProperty(meta.propertyName))
      .flatMap((meta) => meta.groups || []);
    return Array.from(new Set(groups));
  }
}
