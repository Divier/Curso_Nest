import { ApiProperty } from '@nestjs/swagger';

/**
 *  @description Clase servicio responsable recibir el parametro y realizar la logica de negocio.
 *
 *  @author Celula Azure
 *
 */
export class ApiResponseDto {
  @ApiProperty()
  responseCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  data: any;

  @ApiProperty()
  messageCode?: string;

  @ApiProperty()
  legacy?: string;

  constructor(responseCode: number, message: string, data: any, transactionId: string, messageCode?: string, legacy?: string) {
    this.responseCode = responseCode;
    this.messageCode = messageCode;
    this.message = message;
    this.timestamp =  new Date().toISOString();
    this.transactionId = transactionId;
    this.legacy = legacy;
    this.data = data;
  }
}
