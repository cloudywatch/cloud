import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { GrnService } from "./grn.service";
import { AuthGuard } from "../auth/auth.guard";
import { Request, Response } from 'express';
// import {Parser} from "json2csv";
import { Grn } from "./grn.entity";
import { GrnItem } from "./grn-item.entity";
import { AbstractController } from 'src/common/abstract.controller';

@Controller('grn')
export class GrnController extends AbstractController {
    constructor(private grnService: GrnService) { super(grnService); }

    // @Get('list')
    // async listGrns(
    //     @Query('page') current_page: number = 1,        
    //     @Req() request: Request,
    //     @Res() response: Response,
    //     order: {}
    // ) {

    //     try {
    //         const relationsArray = request.query.relations
    //         ? request.query.relations.toString().split(',')
    //         : [];
    //         console.log('somak..'+relationsArray);
    //         // const output = await this.orderService.paginateOrders(current_page, relationsArray, order);
    //         const output = await this.orderService.paginateOrders(current_page, ['order_items']);
    //         console.log('somak pinter here:', output);
    //         const { data, meta } = output;

    //         const { count, page, pages } = meta;
    //         const pagination = { page, pages, count };

    //         if (count > 0) {
    //             //console.log('somak123 is shyamnagar here...'+ JSON.stringify(data));
    //             return response.status(200).json({
    //                 success: true,
    //                 result: data,
    //                 pagination,
    //                 message: 'Successfully found all documents',
    //             });
    //         } else {
    //             return response.status(203).json({
    //                 success: false,
    //                 result: [],
    //                 pagination,
    //                 message: 'Collection is Empty',
    //             });
    //         }
    //     } catch (err) {
    //         return response.status(500).json({
    //             success: false,
    //             result: [],
    //             message: 'Oops there is an Error',
    //             error: err,
    //         });
    //     }
    // }

    // @Get('all')
    // async all(@Query('page') page = 1) {
    //     return this.orderService.paginate(page, ['order_items']);
    // }

    // @Post('export')    
    // async export(@Res() res: Response) {
    //     const parser = new Parser({
    //         fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity']
    //     });

    //     const orders = await this.orderService.all(['order_items']);

    //     const json = [];

    //     orders.forEach((o: Order) => {
    //         json.push({
    //             ID: o.id,
    //             Name: o.name,
    //             Email: o.email,
    //             'Product Title': '',
    //             Price: '',
    //             Quantity: ''
    //         });

    //         o.order_items.forEach((i: OrderItem) => {
    //             json.push({
    //                 ID: '',
    //                 Name: '',
    //                 Email: '',
    //                 'Product Title': i.product_title,
    //                 Price: i.price,
    //                 Quantity: i.quantity
    //             });
    //         })
    //     });

    //     const csv = parser.parse(json);
    //     res.header('Content-Type', 'text/csv');
    //     res.attachment('orders.csv');
    //     return res.send(csv);
    // }

    // @Get('chart')    
    // async chart() {
    //     return this.orderService.chart();
    // }
}
