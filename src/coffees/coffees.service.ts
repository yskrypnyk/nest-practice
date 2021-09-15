import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {Coffee} from "./entities/coffee.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {Flavor} from "./entities/flavor.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";

@Injectable()
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>
    ) {} //database entity connection

    findAll(paginationQuery: PaginationQueryDto){
        const {limit, offset} = paginationQuery

        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset, //offset
            take: limit, //limit
        });
    }

    async findOne(id: string){
        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors']
        })
        if (!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return coffee
    }

    async create(createCoffeeDto: CreateCoffeeDto){

        //Promise.all waits until all the async promises are finished
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        ) //as a result we get an array of flavors

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        })
        return this.coffeeRepository.save(coffee)
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto){

        const flavors =
            updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
            ))

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        });
        if (!coffee){
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return this.coffeeRepository.save(coffee)
    }

    async remove(id: string){
        const coffee = await this.findOne(id)
        return this.coffeeRepository.remove(coffee)
    }

    private async preloadFlavorByName(name: string): Promise<Flavor>{
        const existingFlavor = await this.flavorRepository.findOne({name});
        if (existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({name});
    }
}
