import { Injectable } from '@nestjs/common';
import { AbstractService } from "../common/abstract.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Grn } from "./grn.entity";
import { GrnItem } from "./grn-item.entity";
import { In, Not, Repository } from 'typeorm';
import { PaginatedResult } from "../common/paginated-result.interface";
// import {BaseTransaction} from "./BaseTransaction";
import { BaseTransaction } from "../common/BaseTransaction";
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import { RakeStatusService } from 'src/rakeStatus/rakeStatus.service';
import { RakeStatus } from 'src/rakeStatus/models/rakeStatus.entity';
import { RakeService } from 'src/rake/rake.service';
import { Product } from 'src/product/models/product.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class GrnService extends AbstractService {
    constructor(
        @InjectRepository(Grn) private readonly grnRepository: Repository<Grn>,
        @InjectRepository(GrnItem) private readonly grnItemRepository: Repository<GrnItem>,
        private productService: ProductService,
        private rakeStatusService: RakeStatusService,
        private rakeService: RakeService,
        private readonly connection: Connection,
        private readonly baseTransaction: BaseTransaction
    ) { super(grnRepository); }

    // async paginateGrns(page: number = 1, relations = []): Promise<any> {
    //     const take = 10;        
    //     const [data, count] = await this.grnRepository.findAndCount({
    //         where: [{
    //             'removed': false, order_items: [{'removed': false}],                
    //         }],
    //         order: {
    //             'id': 'ASC',
    //         },                
    //         take,
    //         skip: (page - 1) * take,
    //         relations: ['order_items']
    //     });
    //     // console.log('data, count', data, count);
    //     return {
    //         data: data.map((order: Order) => {
    //             // console.log('order.name', order.id, order.name, order.email, order.created_at);
    //             return ({
    //                 id: order.id,
    //                 name: order.name,
    //                 first_name: order.first_name,
    //                 last_name: order.last_name,
    //                 email: order.email,                    
    //                 created_at: order.created_at,
    //                 items: order.order_items
    //             });
    //         }),
    //         meta: {
    //             count,
    //             page,
    //             pages: Math.ceil(count/take)
    //         }
    //     }
    // }    

    async create(data): Promise<any> {
        const { grn_items, } = data;

        const myCallback = async function (queryRunner: QueryRunner) {
            const grnData = await queryRunner.manager.save(Grn, data);
            grn_items.map(async item => {
                const itemdata = { grn: { ...grnData }, ...item };
                await queryRunner.manager.save(GrnItem, itemdata);
                const prd = await this.productService.findOne({ id: item.grdt_prms_prdid, });
                let { netqty, totalin } = prd; netqty += item.grdt_qty; totalin += item.grdt_qty;
                const updtprdqty = await queryRunner.manager.update(Product, { id: item.grdt_prms_prdid, }, { netqty, totalin });
                // const rkHasItemOnGrnDt = await this.rakeStatusService
                //     .findOne({ 'rast_rams_id': item.grdt_rams_id, 'rast_prms_prdid': item.grdt_prms_prdid, 'rast_grhd_grndt': grnData.grhd_grndt, });
                // if (rkHasItemOnGrnDt) {
                //     const itemdataz = await queryRunner.manager
                //         .update(RakeStatus, { id: rkHasItemOnGrnDt.id }, { rast_qty: rkHasItemOnGrnDt.rast_qty + item.grdt_qty, });
                // }
                // else {
                const r = await this.rakeService.findOne({ id: item.grdt_rams_id, });
                await queryRunner.manager
                    .save(RakeStatus,
                        {
                            rast_rams_code: r.rams_code, rast_prms_prdid: item.grdt_prms_prdid,
                            rast_prms_prdcd: item.product.prms_prdcd, rast_qty: item.grdt_qty,
                            rast_grhd_grndt: grnData.grhd_grndt, rast_rams_id: item.grdt_rams_id,
                        });
                // }
            });
            return grnData;
        };
        return await this.baseTransaction.runTransaction(myCallback);
    }
    // grhd_grnno, grhd_grndt, grhd_inv_no, grhd_inv_dt, grhd_veh_no, grhd_clms_code
    async updateNonDeleted(condition: { id: null }, data): Promise<any> {
        const { items: grn_items, ...hdrItems } = data;

        const myCallback = async function (queryRunner: QueryRunner) {
            // console.log('somak good eto obdi toh eshechey', order_items);    
            const grnData = await queryRunner.manager.update(Grn, condition.id, hdrItems);
            // console.log('somak eto obdi toh eshechey');
            let itemIdArray = [];
            grn_items.map(async item => {
                const itemdata = { grn: condition.id, ...item };
                // const itemdata = { grn: { ...hdrItems, id: condition.id }, ...item };

                const prd = await this.productService.findOne({ id: item.grdt_prms_prdid, });
                let { netqty, totalin } = prd;
                const rkHasItemOnGrnDt = await this.rakeStatusService
                        .findOne({ 'rast_rams_id': item.grdt_rams_id, 'rast_prms_prdid': item.grdt_prms_prdid, 'rast_grhd_grndt': hdrItems.grhd_grndt, });
                if (item.id == undefined) {
                    // const orderItemSaved = await queryRunner.manager.save(OrderItem, { product_title, price, quantity, removed: false, order: { ...orderData } });                    
                    const grnItemSaved = await queryRunner.manager.save(GrnItem, itemdata);

                    netqty += item.grdt_qty; totalin += item.grdt_qty;
                    const updtprdqty = await queryRunner.manager.update(Product, { id: item.grdt_prms_prdid, }, { netqty, totalin });

                    
                    if (rkHasItemOnGrnDt) {
                        const itemdataz = await queryRunner.manager
                            .update(RakeStatus, { id: rkHasItemOnGrnDt.id }, { rast_qty: (rkHasItemOnGrnDt.rast_qty + item.grdt_qty), });
                    }
                    else {
                        const r = await this.rakeService.findOne({ id: item.grdt_rams_id, });
                        await queryRunner.manager
                            .save(RakeStatus,
                                {
                                    rast_rams_code: r.rams_code, rast_prms_prdid: item.grdt_prms_prdid,
                                    rast_prms_prdcd: item.product.prms_prdcd, rast_qty: item.grdt_qty,
                                    rast_grhd_grndt: hdrItems.grhd_grndt, rast_rams_id: item.grdt_rams_id,
                                });
                    }

                    itemIdArray.push(grnItemSaved.id);
                    return false;
                }
                123
                const grndtl = await this.grnItemRepository.findOne({ id: item.id, });
                netqty = (netqty - grndtl.grdt_qty) + item.grdt_qty; totalin = (totalin - grndtl.grdt_qty) + item.grdt_qty;
                const updtprdqty = await queryRunner.manager.update(Product, { id: item.grdt_prms_prdid, }, { netqty, totalin });

                const itemdataz = await queryRunner.manager.update(GrnItem, { id: item.id }, itemdata);
                // const itemdataz = await queryRunner.manager.update(OrderItem, {id: item.id}, { product_title: product_title, price: price, quantity: quantity, removed: false, order: condition.id });
                const itmdataz = await queryRunner.manager
                    .update(RakeStatus,
                        { 'rast_rams_id': item.grdt_rams_id, 'rast_prms_prdid': item.grdt_prms_prdid, 'rast_grhd_grndt': hdrItems.grhd_grndt, },
                        { rast_qty: (rkHasItemOnGrnDt.rast_qty - grndtl.grdt_qty) + item.grdt_qty , });
                itemIdArray.push(item.id);
            });
            const grnItemsDelete = await this.grnItemRepository.find({ id: Not(In(itemIdArray)), grn: condition.id, });
            grnItemsDelete.map(async i => {
                const prd = await this.productService.findOne({ id: i.grdt_prms_prdid, });
                let { netqty, totalin } = prd;
                netqty = (netqty - i.grdt_qty); totalin = (totalin - i.grdt_qty);
                const updtprdqty = await queryRunner.manager.update(Product, { id: i.grdt_prms_prdid, }, { netqty, totalin });

                const rkHasItemOnGrnDt = await this.rakeStatusService
                        .findOne({ 'rast_rams_id': i.grdt_rams_id, 'rast_prms_prdid': i.grdt_prms_prdid, 'rast_grhd_grndt': hdrItems.grhd_grndt, });
                const itmdataz = await queryRunner.manager
                    .update(RakeStatus,
                        { 'rast_rams_id': i.grdt_rams_id, 'rast_prms_prdid': i.grdt_prms_prdid, 'rast_grhd_grndt': hdrItems.grhd_grndt, },
                        { rast_qty: (rkHasItemOnGrnDt.rast_qty - i.grdt_qty), });

            })

            const grnitemData = await queryRunner.manager.delete(GrnItem, { id: Not(In(itemIdArray)), grn: condition.id, });
            // const grnitemData = await queryRunner.manager.update(OrderItem, { id: Not(In(itemIdArray)) }, { removed: true });
            return grnData;
        };
        return await this.baseTransaction.runTransaction(myCallback);

    }

    // async updateNonDeleted(condition: {id: null}, data): Promise<any> {
    //     const { items: order_items, first_name, last_name, email } = data;

    //     const myCallback = async function(queryRunner: QueryRunner) { 


    //         order_items.map(async item => {    
    //             const { product_title, price, quantity } = item;

    //             if(item.id == undefined){                    
    //                 // const orderItemSaved = await queryRunner.manager.save(OrderItem, { product_title, price, quantity, removed: false, order: { ...orderData } });         
    //                 const itemdata = {order: { id: condition.id }, ...item};               
    //                 const orderItemSaved = await queryRunner.manager.save(OrderItem, itemdata);
    //                 // itemIdArray.push(orderItemSaved[0].id);
    //                 return false;
    //             }               

    //             console.log('somak itemidz', item.id, product_title);
    //             const itemdataz = await queryRunner.manager.update(OrderItem, {id: item.id}, { product_title });                
    //         });            

    //         return order_items;
    //     };
    //     return  await this.baseTransaction.runTransaction(myCallback);        
    // }


    // async create(data): Promise<any> {
    //     const queryRunner = this.connection.createQueryRunner();
    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();

    //     try {                   
    //         // const orderData = await queryRunner.manager.create(Order, data);
    //         const orderData = await queryRunner.manager.save(Order, data);
    //         console.log('somak create dhuklo orderdata: ', orderData);

    //         // const { id: orderid, ...others} = orderData;            
    //         // console.log('somak order items2.1 : ', orderid);
    //         const { order_items, ...order_header } = data;
    //         order_items.map(async item => {                
    //             // const itemdata = {order: { id: orderid }, ...item};
    //             const itemdata = {order: { ...orderData }, ...item};
    //             console.log('somak order items3: ', itemdata);
    //             // this.orderItemRepository.save(itemdata);
    //             await queryRunner.manager.save(OrderItem, itemdata);                
    //         });

    //         await queryRunner.commitTransaction();
    //         return orderData;
    //     } catch (err) {
    //         await queryRunner.rollbackTransaction();
    //     } finally {
    //         await queryRunner.release();
    //     }
    // }   

    // async chart() {
    //     return this.orderRepository.query(`
    //         SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, sum(i.price * i.quantity) as sum
    //         FROM orders o
    //         JOIN order_items i on o.id = i.order_id
    //         GROUP BY date;
    //     `);
    // }
}
