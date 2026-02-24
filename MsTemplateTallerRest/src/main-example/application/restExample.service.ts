import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { getMetadataStorage } from 'class-validator';
import config from '../../share/domain/resources/env.config';
import { BusinessException } from '../../share/domain/config/business-exceptions';
//import { IProviderService } from '../infrastructure/rest/provider.service';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import {
  EHttpMethod,
  IRequestConfigHttp,
} from '../../share/domain/config/request-config-http.models';
import { NewContractRequest } from '../domain/dto/restExample.request.dto';
import {
  ERROR,
  ERROR_TIMEOUT,
  Etask,
  MSG_500,
  MSG_503,
  MSG_504,
  MSG_EMPATY_FILTERS,
  MSG_LEGACY_503,
  MSG_LEGACY_504,
  OK,
} from '../../share/domain/resources/constants';
import { ResponseLegacy } from '../domain/dto/restExample.response.dto';
import { AppLoggerService } from '../../share/domain/config/logger.service';

/**
 *  @description Clase servicio responsable recibir el parametro y realizar la logica de negocio.
 *  @author Celula Azure
 */
