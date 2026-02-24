"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const apm_service_1 = require("./share/domain/config/apm.service");
const apmService = new apm_service_1.ApmService();
if (apmService.isStarted())
    console.log('APM started');
const platform_fastify_1 = require("@nestjs/platform-fastify");
const compress_1 = require("@fastify/compress");
const helmet_1 = require("helmet");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const env_config_1 = require("./share/domain/resources/env.config");
const logger_service_1 = require("./share/domain/config/logger.service");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const constants_1 = require("./share/domain/resources/constants");
async function bootstrap() {
    const adapter = new platform_fastify_1.FastifyAdapter({
        keepAliveTimeout: 65000,
        maxRequestsPerSocket: 100,
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter, { logger: new logger_service_1.AppLoggerService() });
    await app.register(compress_1.default, {
        encodings: ['br'],
        global: true,
    });
    const fastifyHelmetPlugin = require('@fastify/helmet');
    await app.register(fastifyHelmetPlugin, {
        global: true,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.setGlobalPrefix(constants_1.SERVICE_PREFIX);
    const configSwagger = new swagger_1.DocumentBuilder()
        .setTitle(constants_1.SERVICE_NAME)
        .setDescription(constants_1.SERVICE_DESCRIPTION)
        .setVersion(constants_1.SERVICE_VERSION)
        .build();
    const documentSwagger = swagger_1.SwaggerModule.createDocument(app, configSwagger);
    swagger_1.SwaggerModule.setup('api', app, documentSwagger);
    await app.listen(app.get(env_config_1.default.KEY).PORT, '0.0.0.0');
    app.use((0, helmet_1.default)({
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
        },
    }));
    app
        .get(common_1.Logger)
        .log(`Application is running on: ${await app.getUrl()}`, 'Main');
}
bootstrap();
//# sourceMappingURL=main.js.map