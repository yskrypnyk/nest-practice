import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CoffeesModule} from './coffees/coffees.module';
import {TypeOrmModule} from "@nestjs/typeorm"; //enable database connection
import {IS_DEV} from './constants/consts'
import {CoffeeRatingModule} from './coffee-rating/coffee-rating.module';
import {DatabaseModule} from './database/database.module';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        CoffeesModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadEntities: true,
            //must be disabled in production
            synchronize: IS_DEV
        }),
        CoffeeRatingModule,
        DatabaseModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
