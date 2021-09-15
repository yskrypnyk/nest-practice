import {Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable} from "typeorm";
import {Flavor} from "./flavor.entity";

// @Entity('coffees') // sql table === 'coffees'
@Entity() // sql table === 'coffee'
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() //required
    name: string

    @Column() //required
    brand: string

    @JoinTable() //specifies owner side of relationship
    @ManyToMany(
        type => Flavor, //foreign entity type
        (flavor) => flavor.coffees //foreign entity parameter
    )
    flavors: string[]
}