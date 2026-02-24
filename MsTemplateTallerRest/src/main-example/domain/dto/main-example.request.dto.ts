import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';
import { TYPE_SEARCH } from '../../../share/domain/resources/constants';

/**
 *  @description El objeto de transferencia de datos es un objeto que define cómo se enviarán los
 *  datos a través de la red, adicional se pueden usar decoradores de class validator para la definicion
 *  de datos obligatorios o metodos de swagger.
 *
 *  @author Celula Azure
 *
 */
export class MainExampleRequest {
  @ApiProperty({
    description: 'Canal que realiza la transacción',
    required: true,
  })
  @IsString({ message: `El campo $property debe ser una cadena de texto` })
  @IsNotEmpty({ message: `El campo $property no puede estar vacío` })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly transactionChannel: string;

  @ApiProperty({
    description: 'Número del suscriptor (Movil: MSISDN, Hogar: ISDN)',
    required: false,
  })
  @ValidateIf((o) => o.subscriberNumber !== undefined, {
    groups: [TYPE_SEARCH.TYPE_SEARCH_SUBSCRIBERNUMBER],
  })
  @IsOptional()
  @IsNumberString(null, { message: `El campo $property solo acepta Números` })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly subscriberNumber?: string;

  @ApiProperty({ description: 'Número de cuenta del cliente', required: false })
  @ValidateIf((o) => o.accountNumber !== undefined, {
    groups: [TYPE_SEARCH.TYPE_SEARCH_ACCOUNTNUMBER],
  })
  @IsOptional()
  @IsNumberString(null, { message: `El campo $property solo acepta Números` })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly accountNumber?: string;

  @ApiProperty({
    description: 'Número del documento financiero a consultar',
    required: false,
  })
  @ValidateIf((o) => o.financialDocID !== undefined)
  @IsOptional()
  @IsNumberString(null, { message: `El campo $property solo acepta Números` })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly financialDocID?: string;

  @ApiProperty({
    description: 'Estado del documento financiero a consultar',
    required: false,
  })
  @ValidateIf((o) => o.financialDocStatus !== undefined)
  @IsOptional()
  @IsString({ message: `El campo $property debe ser una cadena de texto` })
  @IsNotEmpty({ message: `El campo $property no puede estar vacío` })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly financialDocStatus?: string;

  @ApiProperty({
    description: 'Referencia de pago del documento',
    required: false,
  })
  @ValidateIf((o) => o.paymentReference !== undefined, {
    groups: [TYPE_SEARCH.TYPE_SEARCH_PAYMENTREFERENCE],
  })
  @IsOptional()
  @IsString({ message: `El campo $property debe ser una cadena de texto` })
  @IsNotEmpty({ message: `El campo $property no puede estar vacío` })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly paymentReference?: string;

  @ApiProperty({
    description:
      'Fecha de vencimiento del documento desde cuando se realiza la consulta',
    required: false,
  })
  @ValidateIf((o) => o.dueDateFrom !== undefined)
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-05:00$/, {
    message:
      'El campo $property debe tener el formato YYYY-MM-DDThh:mm:ss-05:00',
  })
  readonly dueDateFrom?: string;

  @ApiProperty({
    description:
      'Fecha de vencimiento del documento hasta cuando se realiza la consulta',
    required: false,
  })
  @ValidateIf((o) => o.dueDateTo !== undefined)
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-05:00$/, {
    message:
      'El campo $property debe tener el formato YYYY-MM-DDThh:mm:ss-05:00',
  })
  readonly dueDateTo?: string;

  @ApiProperty({
    description: 'Límite de registros a retornar',
    required: true,
  })
  @Min(1, { message: 'El campo $property debe ser mayor que 0' })
  readonly resultLimit: number;

  @ApiProperty({
    description:
      'Valor que indicara si se requiere validar en tabla bridge el número de línea o cuenta',
    required: false,
  })
  @ValidateIf((o) => o.validarTB !== undefined)
  @IsOptional()
  @IsBoolean({
    message: `El campo $property solo acepta valores 'true' o 'false'`,
  })
  readonly validarTB?: boolean;
}
