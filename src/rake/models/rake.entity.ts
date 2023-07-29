import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { System } from "src/system/models/system.entity";

@Entity('rake_mstr')
export class Rake {

    @PrimaryGeneratedColumn()
    id: number;    

    @Column({type: "varchar", length: 255,})
    rams_code: string;

    @Column({type: "varchar", length: 255,})
    rams_name: string;

    @Column({type: "varchar", length: 255,})
    rams_floor: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    rams_totvol: number;

    @ManyToOne(() => System)
    @JoinColumn({name: 'rams_syms_id'})
    system: System;

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
