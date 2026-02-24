import { ApiProperty } from '@nestjs/swagger';

/**
 * Objeto de respuesta de la operación actual
 */
export class ExampleOracleResponseDTO {

    @ApiProperty({type: String, required: true, description: 'Si o No tuvo cambio de simcard'})
    cambioSim: string;

    @ApiProperty({type: String, required: true, description: 'Resultado de la petición rest'})
    mensajeRespuesta: string;

    @ApiProperty({type: String, description: 'En caso de tener cambio de simcard, se especifica en que fecha'})
    fechaUltimoCambioSim?: string;
}