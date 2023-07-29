import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn, ManyToOne, } from "typeorm";
import {GrnItem} from "./grn-item.entity";
import { Client } from "src/client/models/client.entity";
import {Exclude, Expose} from "class-transformer";

@Entity('grn_hdr')
export class Grn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 255,}) 
    grhd_grnno: string;

    @Column({ type: 'date' })
    grhd_grndt: Date;    

    @Column("varchar", { length: 255 })
    grhd_inv_no: string;

    @Column({ type: 'date' })
    grhd_inv_dt: Date;    

    @Column("varchar", { length: 255 })
    grhd_veh_no: string;

    // @Column("varchar", { length: 255 })
    // grhd_clms_code: string;
    
    @ManyToOne(() => Client)
    @JoinColumn({ name: 'grhd_clms_code', referencedColumnName: "clms_code" })
    client: Client;    

    @OneToMany(() => GrnItem, grnItem => grnItem.grn)
    grn_items: GrnItem[];    

    @Expose()
    get grnvol(): number {
        return this.grn_items.reduce((sum, i) => sum + i.linevol , 0);
    }

    // @Expose()
    // get grnvol(): number {
    //     return this.grn_items.reduce((sum, i) => sum + i.grdt_qty * i.product.prms_unqnty , 0);
    // }

    // @Expose()
    // get name(): string {
    //     return `${this.first_name} ${this.last_name}`;
    // }
}
