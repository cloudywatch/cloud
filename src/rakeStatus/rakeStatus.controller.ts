import { Controller, Get, Post, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { RakeStatusService } from './rakeStatus.service';
import { RakeStatus } from './models/rakeStatus.entity';
import { RakeStatusDto } from './models/rakeStatus.dto';
import { AuthService } from 'src/auth/auth.service';
import { AbstractController } from 'src/common/abstract.controller';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Repository, Like, ILike, Between, Not, In, LessThan, MoreThan, LessThanOrEqual, MoreThanOrEqual, Equal, Any, IsNull, } from 'typeorm';

@Controller('rakeStatus')
export class RakeStatusController extends AbstractController {
    constructor(private rakeStatusService: RakeStatusService, private authService: AuthService) { super(rakeStatusService); }

    // @Get('list')
    // async listRakes( @Query('page') current_page: number = 1, @Req() request: Request,
    //     @Res() response: Response, order: {}
    // ) {

    //     try {   
    //         // order: { 'rake.rams_code': 'ASC' };
    //         order = { 'rake.id': 'DESC' };
    //         const relations = request.query.relations ? JSON.parse(request.query.relations.toString()) : '';
    //         const conditions = [{rast_qty: Not(0)}];
            
    //         const output = await this.rakeStatusService.paginate(current_page, conditions, relations, order);
    //         const { data, meta } = output;
    //         const { count, page, pages } = meta;
    //         const pagination = { page, pages, count };

    //         if (count >= 0) {
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

}
