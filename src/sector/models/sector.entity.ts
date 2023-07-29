import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";

@Entity('sect_mstr')
export class Sector {

    @PrimaryGeneratedColumn()
    id: number;    

    @Column({type: "varchar", length: 255,})
    sems_name: string;

    @Column("varchar", { length: 255 })
    sems_from: string;

    @Column("varchar", { length: 255 })
    sems_to: string;    

    @Column("varchar", { length: 15 })
    sems_range: string;    

    // @Column("simple-array")
    // names: string[];
    // const user = new User()
    // user.profile = { name: "John", nickname: "Malkovich" }

    // @Column({
    //     type: "varchar",
    //     length: 150,
    //     unique: true,    
    // })
    // name: string;
}
