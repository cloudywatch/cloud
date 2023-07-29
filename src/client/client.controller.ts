import { Controller, Get, Post, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './models/client.entity';
import { ClientDto } from './models/client.dto';
import { AuthService } from 'src/auth/auth.service';
import { AbstractController } from 'src/common/abstract.controller';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('client')
export class ClientController extends AbstractController {
    constructor(private clientService: ClientService, private authService: AuthService) { super(clientService); }

    // @Post()
    // async create(@Body() body: ClientDto): Promise<Client> {        
    //     return this.clientService.create({ body, });
    // }

    // @Get('list')
    // async all(@Query('page') pageno: number = 1, @Req() request: Request, @Res() response: Response,) {
    //     try {            
    //         const output = await this.clientService.paginate(pageno);
    //         const { data, meta } = output;
    //         const { count, page, pages, } = meta;            
    //         const pagination = { page, pages, count };            
    //         if (count >= 0) {
    //             // console.log(`somak123+ shyamnagar here...`+ JSON.stringify(data) + JSON.stringify(pagination));
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
    //         // console.log('somak my dear:',err);
    //         return response.status(500).json({
    //             success: false,
    //             result: [],
    //             message: 'Oops there is an Error',
    //             error: err,
    //         });
    //     }        
    // }    

    // @Get(':id')
    // async get(@Param('id') id: number) {
    //     return await this.clientService.findOne({ id });
    // }    

    // @Put(':id')
    // async update(@Param('id') id: number, @Body() body: ClientDto){        
    //     await this.clientService.update(id, body);
    //     return await this.clientService.findOne({ id });
    // }

    // @Delete(':id')
    // async delete(@Param('id') id: number) {
    //     return await this.clientService.delete(id);
    // }    

}
