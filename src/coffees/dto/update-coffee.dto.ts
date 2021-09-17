import {
    PartialType, //returns the type of class with all of the properties set to OPTIONAL
} from "@nestjs/swagger"; //IMPORTANT FOR SWAGGER
import {CreateCoffeeDto} from "./create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto){}
