import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    removed: boolean;

    @Column()
    codeName: string;

    @Column()
    displayName: string;

    @Column()
    dashboardType: string;

    @Column()
    authorizedPages: string;

    @CreateDateColumn()
    created: string;
}