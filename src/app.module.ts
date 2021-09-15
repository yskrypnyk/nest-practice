import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import {TypeOrmModule} from "@nestjs/typeorm"; //enable database connection
import {Constants} from './settings/consts'
@Module({
  imports: [CoffeesModule, TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'pass123',
    database:'postgres',
    autoLoadEntities: true,
    //must be disabled in production
    synchronize: Constants.IS_DEV
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
