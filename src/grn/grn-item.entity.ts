import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Grn } from "./grn.entity";
import { Product } from "src/product/models/product.entity";
import { Rake } from "src/rake/models/rake.entity";
import { Exclude, Expose } from "class-transformer";

@Entity('grn_dtl')
export class GrnItem {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // grdt_grhd_id: number;

    @Column({ type: "varchar", length: 255, })
    grdt_grnno: string;

    // @Column()
    // grdt_prms_prdid: number;

    @Column({ type: "varchar", length: 255, })
    grdt_prms_prdcd: string;

    @Column()
    grdt_qty: number;

    // @Column()
    // grdt_rams_id: number;

    @ManyToOne(() => Grn, grn => grn.grn_items)
    @JoinColumn({ name: 'grdt_grhd_id' })
    grn: Grn;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'grdt_prms_prdid' })
    product: Product;

    @ManyToOne(() => Rake)
    @JoinColumn({ name: 'grdt_rams_id' })
    rake: Rake;

    @Expose()
    get linevol(): number {
        return this.grdt_qty * this.product.prms_unqnty;
    }

    // @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, })
    // prms_unqnty: number;
}
