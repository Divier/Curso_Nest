import { EmessageMapping, Etask } from "./../resources/constants";


/**
 * Custom exception que maneja las excepciones de negocio
 */
export class BusinessException {

  constructor(
    public readonly code: number,
    public readonly description: string,
    public readonly success: boolean = false,
    public readonly details?: IoptionalDetails
  ) { }
}

export interface IoptionalDetails {
  readonly codMessage?: EmessageMapping;
  readonly context?: string;
  readonly task?: Etask;
  readonly document?: any;
}
