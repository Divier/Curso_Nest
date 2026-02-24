import { ProviderService } from "../../../../../src/restExample/infrastructure/rest/impl/provider.service.impl";
import { ApiResponseDto } from "../../../../../src/share/domain/dto/apiResponse.dto";
import { Etask } from "../../../../../src/share/domain/resources/constants";
import { EHttpMethod, IRequestConfigHttp } from "../../../../../src/share/domain/config/request-config-http.models";

describe('ProviderService', () => {
  let service: ProviderService;
  beforeEach(() => {
    service = new ProviderService({} as any, {} as any, {} as any);
    jest.spyOn(service, 'executeRest').mockResolvedValue(new ApiResponseDto(200, 'OK', { result: true }, '123'));
  });

  it('should call executeRest with Etask.CONSUMO_SERVICIO_REST', async () => {
    const mockRequest: IRequestConfigHttp = {
      url: 'http://test.com',
      method: EHttpMethod.get,
    };
    const result = await service.executeRestImpl(mockRequest);
    expect(service.executeRest).toHaveBeenCalledWith(mockRequest, Etask.CONSUMO_SERVICIO_REST);
    expect(result).toBeInstanceOf(ApiResponseDto);
    expect(result.responseCode).toBe(200);
  });
});
