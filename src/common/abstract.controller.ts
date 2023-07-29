import { Controller, Get, Post, Patch, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { Request, Response } from 'express';

import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';
import { AbstractService } from './abstract.service';
import { lookupService } from 'dns';

@Injectable()
export abstract class AbstractController {
    protected constructor(protected readonly service: AbstractService) { }

    @Post('create')
    async create(@Body() body, @Res() response: Response) {
        // console.log("somak guru.. " + JSON.stringify(body));
        try {
            const result = await this.service.create(body);
            return response.status(200).json({
                success: true,
                result,
                message: 'Successfully Created the document in Model ',
            });
        } catch (err) {
            if (err.name == 'ValidationError') {
                return response.status(400).json({
                    success: false,
                    result: null,
                    message: 'Required fields are not supplied',
                    error: err,
                });
            } else {
                return response.status(500).json({
                    success: false,
                    result: null,
                    message: err.detail,
                    error: err,
                });
            }
        }
    }

    // @Get('read/:id')
    // async getById(@Param('id') id: number, @Res() response: Response) {
    @Get('read')
    async getById(
        @Req() request: Request,
        @Res() response: Response,
        @Query('order') order: {},
    ) {
        try {
            const relations = request.query.relations ? JSON.parse(request.query.relations.toString()) : {};
            const conditions = request.query.conditions ? JSON.parse(request.query.conditions.toString()) : {};
            
            const result = await this.service.findOne(conditions, relations);
            if (!result) {
                return response.status(404).json({
                    success: false,
                    result: null,
                    message: 'No document found by this criteria: ' + conditions,
                });
            } else {
                return response.status(200).json({
                    success: true,
                    result,
                    message: 'we found this document by this criteria: ' + conditions,
                });
            }
        } catch (err) {
            return response.status(500).json({
                success: false,
                result: null,
                message: 'Oops there is an Error',
                error: err,
            });
        }
    }

    @Patch('update/:id')
    async update(@Req() request: Request, @Res() response: Response) {
        try {
            const uresult = await this.service.updateNonDeleted({ 'id': parseInt(request.params.id) }, request.body);
            // console.log('ruko zara bhai', JSON.stringify(uresult), uresult.affected);
            const result = await this.service.findOne([{ 'id': parseInt(request.params.id) }]);
            if (!result) {
                return response.status(404).json({
                    success: false,
                    result: null,
                    message: 'No document found by this id: ' + request.params.id,
                });
            } else {
                return response.status(200).json({
                    success: true,
                    result,
                    message: 'we update this document by this id: ' + request.params.id,
                });
            }
        } catch (err) {
            if (err.name == 'ValidationError') {
                return response.status(400).json({
                    success: false,
                    result: null,
                    message: 'Required fields are not supplied',
                    error: err,
                });
            } else {
                return response.status(500).json({
                    success: false,
                    result: null,
                    message: err.detail,
                    error: err,
                });
            }
        }
    }

    @Delete('delete/:id')
    async delete(@Req() request: Request, @Res() response: Response) {
        try {
            const result = await this.service.delete(parseInt(request.params.id));
            if (!result) {
                return response.status(404).json({
                    success: false,
                    result: null,
                    message: 'No document found by this id: ' + request.params.id,
                });
            } else {
                return response.status(200).json({
                    success: true,
                    result,
                    message: 'Successfully Deleted the document by id: ' + request.params.id,
                });
            }
        } catch (err) {
            return response.status(500).json({
                success: false,
                result: null,
                message: 'Oops there is an Error',
                error: err,
            });
        }
    }

    // @Get('filter')
    // async filter(@Req() request: Request, @Res() response: Response) {
    //     try {
    //         if (request.query.filter === undefined || request.query.equal === undefined) {
    //             return response.status(403).json({
    //                 success: false,
    //                 result: null,
    //                 message: 'filter not provided correctly',
    //             });
    //         }
    //         const result = await this.service.all();            
    //         return response.status(200).json({
    //             success: true,
    //             result,
    //             message: 'Successfully found all documents where equal to : ' + request.params.equal,
    //         });
    //     } catch (err) {
    //         return response.status(500).json({
    //             success: false,
    //             result: null,
    //             message: 'Oops there is an Error',
    //             error: err,
    //         });
    //     }
    // }

    @Get('search')
    async search(@Req() request: Request, @Res() response: Response) {
        if (request.query.q === undefined || request.query.q.toString().trim() === '') {
            return response
                .status(202)
                .json({
                    success: false,
                    result: [],
                    message: 'No document found by this request',
                })
                .end();
        }
        const relationsArray = request.query.relations
            ? request.query.relations.toString().split(',')
            : [];
        const fieldsArray = request.query.fields
            ? request.query.fields.toString().split(',')
            : ['name', 'surname', 'birthday'];
        const fields = { $or: [] };

        for (const field of fieldsArray) {
            fields.$or.push({ [field]: Like(`%${request.query.q.toString().trim()}%`) });
        }
        try {
            let results = await this.service.searchdropdown(fields.$or, relationsArray);

            if (results.length >= 1) {
                return response.status(200).json({
                    success: true,
                    result: results,
                    message: 'Successfully found all documents',
                });
            } else {
                return response
                    .status(202)
                    .json({
                        success: false,
                        result: [],
                        message: 'No document found by this request',
                    })
                    .end();
            }
        } catch (err) {
            return response.status(500).json({
                success: false,
                result: null,
                message: 'Oops there is an Error',
                error: err,
            });
        }
    }

    @Get('list')
    async list(
        @Query('page') current_page: number = 1,
        @Req() request: Request,
        @Res() response: Response,
        @Query('order') order: {},
    ) {

        try {
            // const relationsArray = request.query.relations
            // ? request.query.relations.toString().split(',')
            // : [];            
            // const conditionsArray = request.query.conditions
            // ? [request.query.conditions]
            // : [];           
            // console.log('lehaluaMIA.. '+request.query.conditions);
            // console.log(request.query.conditions.toString().replace(/['"]+/g, ''));
            const relations = request.query.relations ? JSON.parse(request.query.relations.toString()) : {};
            const conditions = request.query.conditions ? JSON.parse(request.query.conditions.toString()) : {};
            // const conditions = request.query.conditions ? JSON.parse(JSON.stringify(request.query.conditions.toString().replace(/['"]+/g, ''))) : {};
            // const conditions = request.query.conditions ? request.query.conditions.toString().replace(/['"]+/g, '') : {};
            // const conditions = request.query.conditions ? 'darunn...' : {};
            // console.log('somak..'  + JSON.stringify(conditions));
            // console.log('somak1..'  + conditions.toString());
            // const relations = {rake: true};
            const output = await this.service.paginate(current_page, conditions, relations, order);
            const { data, meta } = output;
            const { count, page, pages } = meta;
            const pagination = { page, pages, count };
            // console.log('daralobo', JSON.stringify(data), count);

            if (count >= 0) {
                return response.status(200).json({
                    success: true,
                    result: data,
                    pagination,
                    message: 'Successfully found all documents',
                });
            } else {
                return response.status(203).json({
                    success: false,
                    result: [],
                    pagination,
                    message: 'Collection is Empty',
                });
            }
        } catch (err) {
            return response.status(500).json({
                success: false,
                result: [],
                message: 'SERVER ERROR',
                error: err,
            });
        }
    }

    @Get('dropdown')
    async dropdown(@Req() request: Request, @Res() response: Response, @Query('order') order: {}, ) {
        try {
            const relations = request.query.relations ? JSON.parse(request.query.relations.toString()) : {};
            const conditions = request.query.conditions ? JSON.parse(request.query.conditions.toString()) : {};
            // console.log('23JUL2023>14:51=>',JSON.stringify(conditions));
            const results = await this.service.searchdropdown(conditions, relations);
            if (results.length >= 1) {
                return response.status(200).json({
                    success: true,
                    result: results,
                    message: 'Successfully found all documents',
                });
            } else {
                return response.status(203).json({
                    success: false,
                    result: [],
                    message: 'Collection is Empty',
                });
            }
        } catch (err) {
            return response.status(500).json({
                success: false,
                result: [],
                message: 'SERVER ERROR',
                error: err,
            });
        }
    }

    // @Get('list')
    // async list(
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
    //         const output = await this.service.paginate(current_page, relationsArray, order);
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

}