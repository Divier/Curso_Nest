/**
 *  @description El objeto de transferencia de datos es un objeto que define cómo se enviarán los
 *  datos a través de la red, adicional se pueden usar decoradores de class validator para la definicion
 *  de datos obligatorios o metodos de swagger.
 *
 *  @author Celula Azure
 *
 */
export interface ResponseStatus {
  code: string;
  message: string;
  status: string; 
}

export interface BillingResponse {
  responseStatus: ResponseStatus;
}

export interface ResponseLegacy {
  billing: BillingResponse;
}

