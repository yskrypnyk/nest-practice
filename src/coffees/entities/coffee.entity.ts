import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

// @Entity('coffees') // sql table === 'coffees'
@Entity() // sql table === 'coffee'
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() //required
    name: string

    @Column() //required
    brand: string

    @Column('json', {nullable: true})
    flavors: string[]
}