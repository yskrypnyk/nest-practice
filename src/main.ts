import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./common/filter/http-exception.filter";
import {ApiKeyGuard} from "./common/guards/api-key.guard";
import {WrapResponseInterceptor} from "./common/interceptors/wrap-response.interceptor";
import {TimeoutInterceptor} from "./common/interceptors/timeout.interceptor";

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

            transformOptions:{
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

    await app.listen(3000);
}

bootstrap();
