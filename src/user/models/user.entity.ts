import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Role } from "src/role/role.entity";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    removed: boolean;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;    

    @ManyToOne(() => Role)
    @JoinColumn({name: 'role_id'}) 
    role: Role;
}
