import {Module} from '@nestjs/common';
import {CoffeesController} from "./coffees.controller";
import {CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Coffee} from "./entities/coffee.entity";
import {Flavor} from "./entities/flavor.entity";
import {Event} from "../events/entities/event.entity";
import {COFFEE_BRANDS} from "./coffees.constants";

class MockCoffeesService {
}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])], //registering entities array
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        {
            provide: COFFEE_BRANDS, //injected in coffees.service (constructor)
            useValue: ['buddy brew', 'nescafe']
        }
    ],
    exports: [CoffeesService], //this service is used in another service (coffee-rating), therefore must be exported from module
    // if you want to use another class when module is requested
    // providers: [{
    //     provide: CoffeesService,
    //     useValue: new MockCoffeesService()
    // }],
})
export class CoffeesModule {
}
