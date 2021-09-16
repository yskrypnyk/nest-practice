import {Injectable, Module} from '@nestjs/common';
import {CoffeesController} from "./coffees.controller";
import {CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Coffee} from "./entities/coffee.entity";
import {Flavor} from "./entities/flavor.entity";
import {Event} from "../events/entities/event.entity";
import {COFFEE_BRANDS} from "./coffees.constants";

class MockCoffeesService {}

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
    create() {
        /* ... do something ... */
        return ['buddy brew', 'nescafe']
    }
}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])], //registering entities array

    controllers: [CoffeesController],

    providers: [
        CoffeesService,

        /** injectable variable */
        {
            provide: COFFEE_BRANDS, //injected in coffees.service (constructor)
            useValue: ['buddy brew', 'nescafe']
        },

        /** injectable factory */
        CoffeeBrandsFactory,
        {
            provide: COFFEE_BRANDS, //injected in coffees.service (constructor)
            useFactory: (brandsFactory: CoffeeBrandsFactory) =>
                brandsFactory.create(),
            inject: [CoffeeBrandsFactory]
        },

        /** dynamically determine classes based on env */
        {
            provide: ConfigService,
            useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService : ProductionConfigService
        },
    ],

    /** injectable service must be exported in order to be used */
    //this service is used in the constructor of coffee-rating service
    exports: [CoffeesService],
})
export class CoffeesModule {
}
