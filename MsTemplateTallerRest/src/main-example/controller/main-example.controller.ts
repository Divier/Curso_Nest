import { FastifyReply } from 'fastify';
import {
  Controller,
  Get,
  Inject,
  Res,
  Query,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProcessTimeService } from '../../share/domain/config/processTime.service';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import { ApmInterceptor } from '../../share/domain/config/apm.interceptor';
import { AppLoggerService } from '../../share/domain/config/logger.service';
import { MainExampleRequest } from '../domain/dto/main-example.request.dto';
import { NewContractService } from '../application/restExample.service';
import {
  EHttpMethod,
  IRequestConfigHttp,
} from 'src/share/domain/config/request-config-http.models';

/**
 *  @description Archivo controlador responsable de manejar las solicitudes entrantes que llegan a un end point.
 *  En este caso serán posibles acceder por medio de métodos HTTP.
 *
 *  @author Celula Microservicios
 */
@ApiTags('GET/mainOperationExample')
@Controller('GET/mainOperationExample')
@UseInterceptors(ApmInterceptor)
export class MainExampleController {
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly serviceRest: NewContractService,
    private readonly processTimeService: ProcessTimeService,
    private readonly logger: AppLoggerService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Get('getPokemons')
  async restGetPokemonsExampleController(
    @Res() res: FastifyReply,
    @Query() queryParams: MainExampleRequest,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    let serviceResponse: ApiResponseDto;

    const payload: IRequestConfigHttp = {
      url: `https://pokeapi.co/api/v2/pokemon`,
      method: EHttpMethod.get,
      params: {
        limit: queryParams.limit,
        offset: queryParams.offset,
      },
    };

    try {
      this.logger.log(
        'Iniciando procesamiento de información',
        `${this.restGetPokemonsExampleController.name}`,
        processTime.end(),
        this.transactionId,
        JSON.stringify(payload),
      );

      serviceResponse = await this.serviceRest.restService(
        payload,
        processTime,
      );

      serviceResponse = {
        responseCode: 200,
        message: 'Operación exitosa',
        data: serviceResponse.data,
        timestamp: new Date().toISOString(),
        transactionId: this.transactionId,
      };

      res.header(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
      res.status(serviceResponse.responseCode).send(serviceResponse);
    } finally {
      this.logger.log(
        'Procesamiento finalizado',
        `${this.restGetPokemonsExampleController.name}`,
        processTime.end(),
        this.transactionId,
        JSON.stringify(payload),
        JSON.stringify(serviceResponse),
      );
    }
  }

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Get('getPokemonByName/:name')
  async restGetPokemonByNameExampleController(
    @Res() res: FastifyReply,
    @Param('name') name: string,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    let serviceResponse: ApiResponseDto;

    const payload: IRequestConfigHttp = {
      url: `https://pokeapi.co/api/v2/pokemon/${name}`,
      method: EHttpMethod.get,
    };

    try {
      this.logger.log(
        'Iniciando procesamiento de información',
        `${this.restGetPokemonByNameExampleController.name}`,
        processTime.end(),
        this.transactionId,
        JSON.stringify(payload),
      );

      serviceResponse = await this.serviceRest.restService(
        payload,
        processTime,
      );

      if(serviceResponse.responseCode === 404){
        serviceResponse = {
          responseCode: 404,
          message: `Pokemon ${name} no encontrado`,
          data: serviceResponse.data,
          timestamp: new Date().toISOString(),
          transactionId: this.transactionId,
        }
      } else {
        serviceResponse = {
          responseCode: 200,
          message: 'Operación exitosa',
          data: serviceResponse.data,
          timestamp: new Date().toISOString(),
          transactionId: this.transactionId,
        };
      }

      res.header(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
      res.status(serviceResponse.responseCode).send(serviceResponse);
    } finally {
      this.logger.log(
        'Procesamiento finalizado',
        `${this.restGetPokemonByNameExampleController.name}`,
        processTime.end(),
        this.transactionId,
        JSON.stringify(payload),
        JSON.stringify(serviceResponse),
      );
    }
  }
}
