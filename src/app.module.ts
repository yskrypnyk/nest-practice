import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CoffeesModule} from './coffees/coffees.module'; //main coffee module
import {TypeOrmModule} from "@nestjs/typeorm"; //enable database connection
import {IS_DEV} from './constants/consts'
import {CoffeeRatingModule} from './coffee-rating/coffee-rating.module'; //secondary coffee module
import {DatabaseModule} from './database/database.module'; //module that can be used to connect to database
import {ConfigModule} from "@nestjs/config"; //add env file as variable
import * as Joi from "@hapi/joi"; //validation for env file variables
import appConfig from './config/app.config'
import {CommonModule} from './common/common.module';

@Module({
    imports: [

        /** Asynchronous Database connection module */
        //this will be loaded AFTER every other module in app is resolved
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                host: process.env.DATABASE_HOST,
                port: +process.env.DATABASE_PORT,
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                autoLoadEntities: true,
                //must be disabled in production
                synchronize: IS_DEV
            })
        }),

        /** local configuration module */
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV, //makes env file non required
            envFilePath: '.env',//specified env file path
            validationSchema: Joi.object({
                DATABASE_HOST: Joi.required(),
                DATABASE_PORT: Joi.number().default(5432)
            }), //validates env files
            load: [appConfig], //adding a custom config file
        }),

        /** Synchronous Database connection module (MUST BE PLACED AFTER CONFIG)*/
        // TypeOrmModule.forRoot({
        //     type: 'postgres',
        //     host: process.env.DATABASE_HOST,
        //     port: +process.env.DATABASE_PORT,
        //     username: process.env.DATABASE_USER,
        //     password: process.env.DATABASE_PASSWORD,
        //     database: process.env.DATABASE_NAME,
        //     autoLoadEntities: true,
        //     //must be disabled in production
        //     synchronize: IS_DEV
        // }),

        DatabaseModule,
        CoffeesModule,
        CoffeeRatingModule,
        CommonModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,

        /** Registering a global pipe */
        // {
        //     provide: APP_PIPE, //token from nest.js core
        //     useValue: ValidationPipe //Now ValidationPipe is in scope of app module
        // }
    ],
})
export class AppModule {
}
