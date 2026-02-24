import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from "class-transformer";
import { Length, IsNumberString } from 'class-validator'

/**
 * Objeto de entrada de la operación
 */
export class ExampleOracleRequestDTO {

    @ApiProperty({type: String, required: true, description: 'Contiene el número celular a validar'})
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(10, 10, { message: 'El campo min solo acepta 10 caracteres' })
    @IsNumberString({},{message: 'El campo min solo acepta caracteres numéricos'})
    min: string;
    
}