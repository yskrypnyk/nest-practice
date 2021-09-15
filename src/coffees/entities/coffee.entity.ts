import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
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

    @Column({default : 0})
    recommendations: number;

    @JoinTable() //specifies owner side of relationship
    @ManyToMany(
        type => Flavor, //foreign entity type
        (flavor) => flavor.coffees, //foreign entity parameter
        {
            cascade: true // foreign entities, that do not exist, will be added to database
            // cascade: ['insert'] // foreign entities, that do not exist, will be added to database
        }
    )
    flavors: Flavor[]
}