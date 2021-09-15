import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query} from '@nestjs/common';
import {CoffeesService} from "./coffees.service";
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";

@Controller('coffees')
export class CoffeesController {

    //Inject service into controller
    constructor(private readonly coffeesService: CoffeesService) {
    }

    /**
     * GET - returns entity
     */

    //http://localhost:3000/coffees
    // @Get()
    // findAll(): string{
    //     return 'This function returns all coffees';
    // }

    //http://localhost:3000/coffees?limit=20&offset=0
    @Get()
    findAll(@Query() queryParams) {
        // const {limit, offset} = queryParams
        return this.coffeesService.findAll()
    }

    //http://localhost:3000/coffees/1
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffeesService.findOne(id)
    }

    //http://localhost:3000/coffees/flavors
    @Get('flavors') //controller/action can be declared here (coffee/flavors)
    findAllFlavors(): string {
        return 'This action returns all flavors';
    }

    /**
     * POST - creates entity
     */

    //http://localhost:3000/coffees
    @HttpCode(HttpStatus.CREATED) //custom status code
    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto)
    }

    /**
     * PATCH - updates a single property
     */

    //http://localhost:3000/coffees/1
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    /**
     * DELETE - deletes entity
     */

    //http://localhost:3000/coffees/1
    @Delete(":id")
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id)
    }

    /**
     * PUT - updates whole entity
     */
}
