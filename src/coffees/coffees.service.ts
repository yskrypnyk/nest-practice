import {HttpException, HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Coffee} from "./entities/coffee.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, Repository} from "typeorm";
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {Flavor} from "./entities/flavor.entity";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {Event} from "../events/entities/event.entity";
import {COFFEE_BRANDS} from "./coffees.constants";
import {ConfigService, ConfigType} from "@nestjs/config"; //provides a get method for reading configuration variables from env
import coffeesConfig from './config/coffees.config'

@Injectable()
export class CoffeesService {

    constructor(
        /**
         * Database connection
         */
        @InjectRepository(Coffee)  //database entity connection
        private readonly coffeeRepository: Repository<Coffee>,

        @InjectRepository(Flavor)  //database entity connection
        private readonly flavorRepository: Repository<Flavor>,

        private readonly connection: Connection,  //database query connection

        /**
         * Config files
         */
        // has method to retrieve config files
        private readonly configService: ConfigService,

        // injecting a config file
        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,

        /**
         * Injectable variables from module
         */
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    ) {
        /**
         * Injectable variables usage
         */
        console.log(coffeeBrands)

        /**
         * Config examples
         */

        //Retrieving a global service configuration (app.config)
        const globalConfig = this.configService.get<string>(
            'database.host', //value from app.config.ts object
            'localhost' // default value
        )
        console.log(globalConfig)

        // Retrieving a partial module configuration (coffees.config)
        const retrievedConfig = this.configService.get<string>('coffees.foo')
        console.log(retrievedConfig)

        /** BEST PRACTICE */
        // Retrieving an injected config properties
        console.log(coffeesConfiguration.foo)
    }

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

    async recommendCoffee(coffee: Coffee){
        const queryRunner = this.connection.createQueryRunner()

        await queryRunner.connect() //establish connection to database
        await queryRunner.startTransaction()

        //database transaction
        try {
            coffee.recommendations++;

            const recommendEvent = new Event()
            recommendEvent.name = 'recommend_coffee'
            recommendEvent.type = 'coffee'
            recommendEvent.payload = {coffeeId: coffee.id}

            await queryRunner.manager.save(coffee)
            await queryRunner.manager.save(recommendEvent)

            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor>{
        const existingFlavor = await this.flavorRepository.findOne({name});
        if (existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({name});
    }
}
