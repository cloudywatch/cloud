import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Rake } from "src/rake/models/rake.entity";
import { Product } from "src/product/models/product.entity";

@Entity('rake_stat')
export class RakeStatus {
    
    @PrimaryGeneratedColumn()
    id: number;    

    @Column({type: "varchar", length: 255,})
    rast_rams_code: string;

    // @Column()
    // rast_prms_prdid: number;

    @Column("varchar", { length: 255 })
    rast_prms_prdcd: string;

    @Column()
    rast_qty: number;

    @Column({ type: 'date' })
    rast_grhd_grndt: Date;    

    @ManyToOne(() => Rake)
    @JoinColumn({name: 'rast_rams_id'})
    rake: Rake;

    @ManyToOne(() => Product)
    @JoinColumn({name: 'rast_prms_prdid'})
    product: Product;

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
