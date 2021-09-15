import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Coffee} from "./coffee.entity";

// @Entity('coffees') // sql table === 'coffees'
@Entity() // sql table === 'coffee'
export class Flavor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() //required
    name: string

    @ManyToMany(
        type => Coffee, //foreign entity type
        coffee => coffee.flavors, //foreign entity parameter
    )
    coffees: Coffee[];
}