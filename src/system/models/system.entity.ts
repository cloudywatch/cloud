import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";

@Entity('syst_mstr')
export class System {

    @PrimaryGeneratedColumn()
    id: number;    

    @Column({type: "varchar", length: 255,})
    syms_name: string;

    @Column('text')
    syms_desc: string;

    @Column()
    syms_cols: number;

    @Column()
    syms_rows: number;    

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
