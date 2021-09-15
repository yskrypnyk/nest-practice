import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";

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
            // transform: true
        })
    )
    await app.listen(3000);
}

bootstrap();
