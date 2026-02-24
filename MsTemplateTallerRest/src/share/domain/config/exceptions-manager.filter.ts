import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { ApmService } from './apm.service';
import { BusinessException } from '../config/business-exceptions';
import { EmessageMapping, ERROR } from "../resources/constants";
import { ApiResponseDto } from "../dto/apiResponse.dto";
import { v4 as uuidv4 } from 'uuid';
import { ProcessTimeService } from './processTime.service';

/**
 * Clase encargada de hacer el filtro de las excepciones y mapear la respuesta a la estandar
 */
@Catch()
export class ExceptionManager implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionManager.name);
  constructor(
    private readonly apmService: ApmService,
    private readonly processTimeService: ProcessTimeService,
  ) { }

  async catch(exception: any, host: ArgumentsHost) {
    const processTime = this.processTimeService.start();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const correlationId = uuidv4(); // Generate UUID for the response
    const request = ctx.getRequest().body? ctx.getRequest().body: ctx.getRequest().query;
    let result: ApiResponseDto;
    this.logger.log('Iniciando procesamiento de información', `${this.catch.name}`, processTime.end(), correlationId, JSON.stringify(request));
    // Capturing the exception for monitoring (APM)
    if (exception instanceof BusinessException || exception instanceof HttpException || !exception.status) {
      this.apmService.captureError(exception);
    }

    if (exception instanceof BusinessException) {
      // Handle BusinessException
      result = this.createApiResponse(
        exception.code,
        exception?.details?.codMessage || exception?.description,
        exception?.details?.document || exception?.details?.context || {},
        correlationId
      );
    } else if (exception instanceof HttpException) {
      // Handle HttpException
      const status = exception.getStatus();
      if (status === HttpStatus.BAD_REQUEST) {
        const responseMessage = this.formatBadRequestMessage(exception);
        result = this.createApiResponse(status, ERROR, {errorMessage: responseMessage}, correlationId);
      } else {
        result = this.createApiResponse(
          status,
          exception?.getResponse()['message'] || exception.message,
          exception?.getResponse()['data'] || exception?.getResponse()['message'],
          correlationId
        );
      }
    } else {
      // Handle unknown exceptions
      result = this.createApiResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        EmessageMapping.DEFAULT_ERROR,
        exception?.message,
        correlationId
      );
    }
    this.logger.log('Procesamiento finalizado', `${this.catch.name}`, processTime.end(),correlationId, JSON.stringify(request), JSON.stringify(result));
    response.code(result.responseCode).send(result);
  }

  // Helper method to create API response
  private createApiResponse(
    responseCode: number,
    message: string,
    data: any,
    correlationId: string
  ): ApiResponseDto {
    return new ApiResponseDto(responseCode, message, data, correlationId);
  }

  private formatBadRequestMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }
    if (typeof response === 'object' && response !== null) {
      const message = (response as any).message;
      if (Array.isArray(message) && message.every(item => typeof item === 'string')) {
        return message.join(', ');
      }
      if (typeof message === 'string') {
        return message;
      }
      if ((response as any).response?.message) {
        return (response as any).response.message;
      }
    }
    return 'Error desconocido en la solicitud';
  }
}
