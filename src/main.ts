import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./common/filter/http-exception.filter";
import {WrapResponseInterceptor} from "./common/interceptors/wrap-response.interceptor";
import {TimeoutInterceptor} from "./common/interceptors/timeout.interceptor";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //use validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            //unwanted properties of passed data from client is striped and removed (workflow continues)
            whitelist: true,

            //non whitelisted properties request object cause errors (corresponding error message)
            forbidNonWhitelisted: true,

            //converts primitive type into TS-required (@Param) and makes request body an instance of dto but slightly affects performance
            transform: true,

            transformOptions: {
                enableImplicitConversion: true //no longer need to use types decorator
            }
        })
    )

    //use HttpExceptionFilter filter
    app.useGlobalFilters(new HttpExceptionFilter())

    app.useGlobalInterceptors(
        new WrapResponseInterceptor(),
        new TimeoutInterceptor()
    );

    /**
     * Swagger
     */
    const options = new DocumentBuilder()
        .setTitle('Coffee')
        .setDescription('Coffee app')
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)

    await app.listen(3000);
}

bootstrap();
