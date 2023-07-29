import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('ledgers')
export class Ledger {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ default: false })
    // removed: boolean;

    @Column({ unique: true })
    code: string;
    
    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    debitTotal: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    creditTotal: number;
    
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    balance: number;    

    @CreateDateColumn()
    created: string;
}