import { FastifyReply } from 'fastify';
import {
  Controller,
  Get,
  Inject,
  Res,
  Query,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProcessTimeService } from '../../share/domain/config/processTime.service';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import { ApmInterceptor } from '../../share/domain/config/apm.interceptor';
import { AppLoggerService } from '../../share/domain/config/logger.service';
import { MainExampleService } from '../application/main-example.service';
import { MainExampleRequest } from '../domain/dto/main-example.request.dto';

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
    private readonly service: MainExampleService,
    private readonly processTimeService: ProcessTimeService,
    private readonly logger: AppLoggerService,
  ) {}

  @ApiHeader({
    name: 'Channel',
    required: false,
    description: 'Canal que realiza la solicitud',
  })
  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Get()
  async restExampleController(
    @Res() res: FastifyReply,
    @Query() payload: MainExampleRequest,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    let serviceResponse: ApiResponseDto;
    try {
      this.logger.log(
        'Iniciando procesamiento de información',
        `${this.restExampleController.name}`,
        processTime.end(),
        this.transactionId,
        JSON.stringify(payload),
      );
      serviceResponse = await this.service.consultExecOperationExample(
        payload,
        processTime,
      );
      res.header(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
      res.status(serviceResponse.responseCode).send(serviceResponse);
    } finally {
      this.logger.log(
        'Procesamiento finalizado',
        `${this.restExampleController.name}`,
        processTime.end(),
        this.transactionId,
        JSON.stringify(payload),
        JSON.stringify(serviceResponse),
      );
    }
  }
}
