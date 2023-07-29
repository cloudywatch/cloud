import { Controller, Get, Post, Query, Param, Put, Req, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request, Response } from 'express';
import { UserCreateDto } from './models/user-create.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
    constructor(private userService: UserService, private authService: AuthService) { }    

    @Get()
    async all(@Query('page') page: number = 1) {
        return this.userService.paginate(page, ['role']);
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User> {
        const password = await bcrypt.hash('1234', 12);
        const { role_id, ...data } = body;
        return this.userService.create({
            ...data,
            password,
            role: { id: role_id }            
        });
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return await this.userService.findOne([{ id }], ['role']);        
    }   
    
    @Put('info')
    async updateInfo(@Req() request: Request, @Body() body: UserUpdateDto)
    {
        const id = await this.authService.userId(request);
        await this.userService.update(id, body);
        return await this.userService.findOne([{ id }]);
    }   

    @Put(':id')
    async update(@Param('id') id: number, @Body() body: UserUpdateDto){
        const { role_id, ...data } = body;
        await this.userService.update(id,
            {
                ...data,
                role: { id: role_id }
            }
        )
        return await this.userService.findOne([{ id }]);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.userService.delete(id);
    }       

}
