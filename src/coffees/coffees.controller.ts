import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query, SetMetadata,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {CoffeesService} from "./coffees.service";
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Public} from "../common/decorators/public.decorator";

/** injecting a pipe into controller */
//@UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {

    //Inject service into controller
    constructor(private readonly coffeesService: CoffeesService) {
    }

    /**
     * GET - returns entity
     */

    //http://localhost:3000/coffees?limit=20&offset=0
    /** injecting a pipe into single route */
    @UsePipes(ValidationPipe)
    /** adding custom metadata */
    //default
    // @SetMetadata('isPublic', true)
    //using custom decorators
    @Public()
    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        return this.coffeesService.findAll(paginationQuery)
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
    update(
        @Param('id') id: string,
        /** injecting a pipe into parameter */
        @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto
    ) {
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
}
