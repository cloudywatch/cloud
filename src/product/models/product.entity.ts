import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('prod_mstr')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 255 })
    prms_prdcd: string;

    @Column()
    prms_name: string;

    @Column()
    prms_unms_id: number;

    @Column("varchar", { length: 255 })
    prms_unitnm: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    prms_undesc: number;

    @Column()
    prms_uncap: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    prms_unqnty: number;

    @Column('text')
    prms_desc: string;

    @Column()
    prms_rake_cap: number;

    @Column()
    prms_rake_priority: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    totalin: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    totalout: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    netqty: number;
}
