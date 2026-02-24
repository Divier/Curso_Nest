import { Injectable } from "@nestjs/common";

//import { IHttpProvider } from "../../../share/infrastructure/REST/http.provider";
import { IHttpProvider } from "src/share/infrastructure/REST/http.provider";

/**
 * Clase abstracta generica para realizar consumos a legados de tipo Rest
 * @author Edwin Avila
 */
@Injectable()
export abstract class IProviderService extends IHttpProvider {
   abstract executeRestImpl<R = any>(_requestConfig: any, _task?: any): Promise<any>;
}