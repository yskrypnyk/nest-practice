import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger"; //great decorators for validation

export class CreateCoffeeDto {
    @ApiProperty({description: "The name of a coffee"}) //comment for swagger
    @IsString()
    readonly name: string

    @ApiProperty({description: "The brand of a coffee"})
    @IsString()
    readonly brand: string

    @ApiProperty({description: "The flavor of a coffee"})
    @IsString({each: true})
    readonly flavors: string[]
}
