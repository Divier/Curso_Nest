import { Inject, HttpStatus, Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../share/domain/config/logger.service';
import { ApiResponseDto } from './../../share/domain/dto/apiResponse.dto';
import { ExampleOracleResponseDTO } from './../domain/dto/oracleExample.response.dto';
import { ExampleOracleRequestDTO } from './../domain/dto/oracleExample.request.dto';
import { MSG_500, OK } from '../../share/domain/resources/constants';
import { BusinessException } from '../../share/domain/config/business-exceptions';
//import { OracleExampleOracleService } from './../infraestructure/oracle/oracleExample.oracle.service';

/**
 * Clase encargada de definir la lógica de negocio
 */
/*@Injectable()
export class OracleExampleService{
    @Inject('TransactionId') private readonly transactionId: string;

    constructor(
        private readonly logger: AppLoggerService,
        private readonly legacy: OracleExampleOracleService
      ) { }

    async main(request: ExampleOracleRequestDTO, processTime: any):Promise<ApiResponseDto>{
        try{       
            return new ApiResponseDto(200, OK, await this.legacyConsumption(request.min, processTime), this.transactionId);
        }catch(error){
            this.logger.error(error.message, error.stack, __dirname, this.main.name, processTime.end(),this.transactionId);       
            throw new BusinessException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            MSG_500,
            false,
            {
                codMessage: error.message
            }
            );
        }
    }

    async legacyConsumption(min: string, processTime: any): Promise<ExampleOracleResponseDTO>{
        let response: ExampleOracleResponseDTO;
        const legacyResponse = await this.legacy.oracleConsumption(min, processTime);
        if(legacyResponse.P_VC_SALIDA === '1;OK'){
            response = {
                cambioSim : legacyResponse.P_VC_CAMBIO_SIM,
                mensajeRespuesta: 'MENSAJE PROCESADO EXITOSAMENTE',
                fechaUltimoCambioSim: legacyResponse.P_VC_CAMBIO_SIM==='SI'? new Date(legacyResponse.P_DT_FEC_CAMBIO_SIM).toISOString().replace('Z','+00:00'): null
            }
        }else{
            response = {
                cambioSim : 'NO',
                mensajeRespuesta: 'MENSAJE PROCESADO EXITOSAMENTE',
            }
        }
        return response;
    }
}*/