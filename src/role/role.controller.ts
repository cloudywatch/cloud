import { Controller, Get, Post, Patch, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { Request, Response } from 'express';
import { AbstractController } from 'src/common/abstract.controller';

@Controller('role')
export class RoleController extends AbstractController {
    constructor(private roleService: RoleService) { super(roleService); }    

    @Get()
    async all() {
        return await this.roleService.all();
    }

    @Post('create')
    async create(@Body() body, @Res() response: Response) {
        const { displayName, codeName, dashboardType, ...data } = body;
        //console.log("somak bara.. " + JSON.stringify(data));
        try {
            // Creating a new document in the collection        
            const result = await this.roleService.create({
                name: displayName,
                removed: false,
                codeName,
                displayName,
                dashboardType,
                authorizedPages: codeName
            });
            //console.log(result);
            // Returning successfull response
            return response.status(200).json({
                success: true,
                result,
                message: 'Successfully Created the document in Model ',
            });
        } catch (err) {
            // If err is thrown by Mongoose due to required validations
            if (err.name == 'ValidationError') {
                return response.status(400).json({
                    success: false,
                    result: null,
                    message: 'Required fields are not supplied',
                    error: err,
                });
            } else {
                // Server Error
                return response.status(500).json({
                    success: false,
                    result: null,
                    message: 'Oops there is an Error',
                    error: err,
                });
            }
        }

    }

    @Post()
    async createnew(@Body() body): Promise<Role> {
        return this.roleService.create(body);
    }

    //http://localhost:5000/api/role/read/1    
    // @Get('read/:id')
    // async getById(@Param('id') id: number, @Res() response: Response) {
    //     try {
    //         // Find document by id
    //         const result = await this.roleService.findOne({ id, removed: false });

    //         // If no results found, return document not found
    //         if (!result) {
    //             return response.status(404).json({
    //                 success: false,
    //                 result: null,
    //                 message: 'No document found by this id: ' + id,
    //             });
    //         } else {
    //             // Return success resposne
    //             return response.status(200).json({
    //                 success: true,
    //                 result,
    //                 message: 'we found this document by this id: ' + id,
    //             });
    //         }
    //     } catch (err) {
    //         // Server Error
    //         return response.status(500).json({
    //             success: false,
    //             result: null,
    //             message: 'Oops there is an Error',
    //             error: err,
    //         });
    //     }
    // }

    // @Patch('update/:id')
    // async update(@Req() request: Request, @Res() response: Response) {
    //     try {
    //         // Find document by id and updates with the required fields            
    //         await this.roleService.updateNonDeleted({ 'id': parseInt(request.params.id), removed: false }, request.body);
    //         const result = await this.roleService.findOne({ 'id': parseInt(request.params.id), removed: false });

    //         if (!result) {
    //             return response.status(404).json({
    //                 success: false,
    //                 result: null,
    //                 message: 'No document found by this id: ' + request.params.id,
    //             });
    //         } else {
    //             return response.status(200).json({
    //                 success: true,
    //                 result,
    //                 message: 'we update this document by this id: ' + request.params.id,
    //             });
    //         }
    //     } catch (err) {
    //         // If err is thrown by Mongoose due to required validations
    //         if (err.name == 'ValidationError') {
    //             return response.status(400).json({
    //                 success: false,
    //                 result: null,
    //                 message: 'Required fields are not supplied',
    //                 error: err,
    //             });
    //         } else {
    //             // Server Error
    //             return response.status(500).json({
    //                 success: false,
    //                 result: null,
    //                 message: 'Oops there is an Error',
    //                 error: err,
    //             });
    //         }
    //     }
    // }

    @Put()
    async updateentity(
        @Body() body
    ) {
        await this.roleService.update(1, { body })
        return await this.roleService.findOne([{ id: 1 }]);
    }

    // @Delete('delete/:id')
    // async delete(@Req() request: Request, @Res() response: Response) {
    //     try {
    //         // Find the document by id and delete it
    //         let updates = {
    //             removed: true,
    //         };
    //         // Find the document by id and delete it
    //         await this.roleService.update(parseInt(request.params.id), updates);
    //         const result = await this.roleService.findOne({ 'id': parseInt(request.params.id) });

    //         // If no results found, return document not found
    //         if (!result) {
    //             return response.status(404).json({
    //                 success: false,
    //                 result: null,
    //                 message: 'No document found by this id: ' + request.params.id,
    //             });
    //         } else {
    //             return response.status(200).json({
    //                 success: true,
    //                 result,
    //                 message: 'Successfully Deleted the document by id: ' + request.params.id,
    //             });
    //         }
    //     } catch (err) {
    //         return response.status(500).json({
    //             success: false,
    //             result: null,
    //             message: 'Oops there is an Error',
    //             error: err,
    //         });
    //     }

    // }

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
    //         const result = await this.roleService.all();
    //         //.where(request.query.filter)
    //         //.equals(request.query.equal);
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

    // @Get('search')
    // async search(@Req() request: Request, @Res() response: Response) {

    //     if (request.query.q === undefined || request.query.q.toString().trim() === '') {
    //         return response
    //             .status(202)
    //             .json({
    //                 success: false,
    //                 result: [],
    //                 message: 'No document found by this request',
    //             })
    //             .end();
    //     }
    //     const fieldsArray = request.query.fields
    //         ? request.query.fields.toString().split(',')
    //         : ['name', 'surname', 'birthday'];

    //     const fields = { $or: [] };

    //     for (const field of fieldsArray) {
    //         fields.$or.push({ [field]: { $regex: new RegExp(request.query.q.toString(), 'i') } });
    //     }


    //     try {
    //         let results = await this.roleService.all();

    //         if (results.length >= 1) {
    //             return response.status(200).json({
    //                 success: true,
    //                 result: results,
    //                 message: 'Successfully found all documents',
    //             });
    //         } else {
    //             return response
    //                 .status(202)
    //                 .json({
    //                     success: false,
    //                     result: [],
    //                     message: 'No document found by this request',
    //                 })
    //                 .end();
    //         }
    //     } catch (err) {
    //         return response.status(500).json({
    //             success: false,
    //             result: null,
    //             message: 'Oops there is an Error',
    //             error: err,
    //         });
    //     }

    // }

    // @Get('list')
    // async list(
    //     @Query('page') current_page: number = 1,
    //     @Res() response: Response
    // ) {
        
    //     try {
    //         const output = await this.roleService.paginate(current_page);
    //         const { data, meta } = output;
    //         const { total, page, last_page } = meta;
    //         const pagination = { page, last_page, total };

    //         if (total > 0) {
    //             console.log('somak123 is shyamnagar here...'+ JSON.stringify(data));
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
