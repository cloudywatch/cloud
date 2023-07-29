import { Controller, ClassSerializerInterceptor, UseInterceptors, Post, Get, Body, BadRequestException, NotFoundException, Req, Res, UseGuards, Header } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.entity';
import { RegisterDto } from './models/register.dto';
import * as bcrypt from 'bcrypt';
import {Request, Response} from 'express';
import { get } from 'http';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService
        ){}

    @Post('register')
    async register (@Body() body: RegisterDto) {
        if(body.password !== body.confirm_password){
            throw new BadRequestException('Password Not Match');
        }
        const hashed = await bcrypt.hash(body.password, 12);
        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed,
            role: {id: 1, name: 'Admin'}
        })        
    }

    @Post('login')    
    async login(
        @Body('email') email: string,
        @Body('password') passw: string,
        @Res({passthrough: true}) response: Response
        ){
            //console.log('somak is here');
            const  user = await this.userService.findOne([{email}]);
            if( user == null)
                throw new NotFoundException('User Not Found');
            console.log('somak is here');
            console.log('somak is passw here:: '+passw);
            console.log('somak is user.password here:: '+user.password);
            if(! await bcrypt.compare(passw, user.password) )
                throw new BadRequestException('Bad Credentials');            
            //console.log('somak is here1');
            //const jwt = this.jwtService.signAsync(JSON.stringify({id: user.id}));
            const jwt = this.jwtService.signAsync({id: user.id});
            //console.log('somak is here 2');
            response.cookie('jwt',(await jwt).toString(),{httpOnly: true});
            //response.header('Access-Control-Allow-Origin', '*');
            //console.log('somak is here 3');
            const {password, ...data} = user;
            //console.log('somak is here 3'+user.email);
            return ({
                success: true,
                result: {
                  token:(await jwt).toString(),
                  admin: {
                    id: user.id,
                    name: user.first_name+' '+user.last_name,
                    isLoggedIn: true,
                  },
                },
                message: 'Successfully login admin',
              });
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request) {
        const id = await this.authService.userId(request);
        console.log('id== '+id);
        const user = await this.userService.findOne([{id}]);
        return user;
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response){
        response.clearCookie('jwt');
        return { message: 'Somak'}
    }
}
