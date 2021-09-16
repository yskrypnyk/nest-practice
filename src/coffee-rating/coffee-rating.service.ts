import { Injectable } from '@nestjs/common';
import {CoffeesService} from "../coffees/coffees.service";

@Injectable()
export class CoffeeRatingService {
    constructor(
        /** injected coffee service */
        private readonly coffeeService: CoffeesService
    ) {}
}
