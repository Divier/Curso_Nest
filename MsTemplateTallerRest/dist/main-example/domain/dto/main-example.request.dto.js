"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainExampleRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class MainExampleRequest {
}
exports.MainExampleRequest = MainExampleRequest;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Canal que realiza la transacción',
        required: true,
    }),
    (0, class_validator_1.IsString)({ message: `El campo $property debe ser una cadena de texto` }),
    (0, class_validator_1.IsNotEmpty)({ message: `El campo $property no puede estar vacío` }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], MainExampleRequest.prototype, "transactionChannel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número del suscriptor (Movil: MSISDN, Hogar: ISDN)',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.subscriberNumber !== undefined, {
        groups: ["1"],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(null, { message: `El campo $property solo acepta Números` }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], MainExampleRequest.prototype, "subscriberNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de cuenta del cliente', required: false }),
    (0, class_validator_1.ValidateIf)((o) => o.accountNumber !== undefined, {
        groups: ["2"],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(null, { message: `El campo $property solo acepta Números` }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], MainExampleRequest.prototype, "accountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número del documento financiero a consultar',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.financialDocID !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(null, { message: `El campo $property solo acepta Números` }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], MainExampleRequest.prototype, "financialDocID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del documento financiero a consultar',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.financialDocStatus !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: `El campo $property debe ser una cadena de texto` }),
    (0, class_validator_1.IsNotEmpty)({ message: `El campo $property no puede estar vacío` }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], MainExampleRequest.prototype, "financialDocStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Referencia de pago del documento',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.paymentReference !== undefined, {
        groups: ["3"],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: `El campo $property debe ser una cadena de texto` }),
    (0, class_validator_1.IsNotEmpty)({ message: `El campo $property no puede estar vacío` }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    __metadata("design:type", String)
], MainExampleRequest.prototype, "paymentReference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de vencimiento del documento desde cuando se realiza la consulta',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.dueDateFrom !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-05:00$/, {
        message: 'El campo $property debe tener el formato YYYY-MM-DDThh:mm:ss-05:00',
    }),
    __metadata("design:type", String)
], MainExampleRequest.prototype, "dueDateFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de vencimiento del documento hasta cuando se realiza la consulta',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.dueDateTo !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-05:00$/, {
        message: 'El campo $property debe tener el formato YYYY-MM-DDThh:mm:ss-05:00',
    }),
    __metadata("design:type", String)
], MainExampleRequest.prototype, "dueDateTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Límite de registros a retornar',
        required: true,
    }),
    (0, class_validator_1.Min)(1, { message: 'El campo $property debe ser mayor que 0' }),
    __metadata("design:type", Number)
], MainExampleRequest.prototype, "resultLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor que indicara si se requiere validar en tabla bridge el número de línea o cuenta',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.validarTB !== undefined),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({
        message: `El campo $property solo acepta valores 'true' o 'false'`,
    }),
    __metadata("design:type", Boolean)
], MainExampleRequest.prototype, "validarTB", void 0);
//# sourceMappingURL=main-example.request.dto.js.map