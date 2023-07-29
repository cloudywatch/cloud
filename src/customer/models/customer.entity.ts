import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Sector } from "src/sector/models/sector.entity";

@Entity('pty_mstr')
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;    

    @Column({type: "varchar", length: 255,})
    ptms_code: string;

    @Column("varchar", { length: 255 })
    ptms_name: string;

    @Column("varchar", { length: 255 })
    ptms_nicknm: string;

    @Column({type: "varchar", length: 255,})
    ptms_vat: string;

    @Column("varchar", { length: 255 })
    ptms_pan: string;

    @Column("varchar", { length: 255 })
    ptms_excise: string;

    @Column('text')
    ptms_addr: string;

    @Column('text')
    ptms_desc: string;

    @Column("varchar", { length: 15 })
    ptms_phone: string;

    @ManyToOne(() => Sector)
    @JoinColumn({name: 'ptms_sems_id'})
    sector: Sector;

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
