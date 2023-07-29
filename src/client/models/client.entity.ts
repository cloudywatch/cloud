import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";

@Entity('clnt_mstr')
export class Client {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: "varchar", length: 255, unique: true })
    clms_code: string;

    @Column("varchar", { length: 255 })
    clms_name: string;

    @Column("varchar", { length: 255 })
    clms_nicknm: string;

    @Column('text')
    clms_addr: string;

    @Column('text')
    clms_desc: string;

    @Column("varchar", { length: 15 })
    clms_phone: string;    

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
