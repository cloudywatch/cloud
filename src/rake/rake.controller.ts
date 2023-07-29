import { Controller, Get, Post, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { RakeService } from './rake.service';
import { Rake } from './models/rake.entity';
import { RakeDto } from './models/rake.dto';
import { AuthService } from 'src/auth/auth.service';
import { AbstractController } from 'src/common/abstract.controller';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('rake')
export class RakeController extends AbstractController {
    constructor(private rakeService: RakeService, private authService: AuthService) { super(rakeService); }

    @Get('dropdown')
    async getall(@Req() request: Request, @Res() response: Response, @Query('order') order: {}, ) {
        try {
            const relations = request.query.relations ? JSON.parse(request.query.relations.toString()) : {};
            const conditions = request.query.conditions ? JSON.parse(request.query.conditions.toString()) : {};
            // console.log('23JUL2023>14:51=>',JSON.stringify(conditions));
            const results = await this.rakeService.searchdropdown(conditions, relations);
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
}
