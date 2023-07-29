import { Controller, Get, Post, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './models/customer.entity';
import { CustomerDto } from './models/customer.dto';
import { AuthService } from 'src/auth/auth.service';
import { AbstractController } from 'src/common/abstract.controller';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('customer')
export class CustomerController extends AbstractController {
    constructor(private customerService: CustomerService, private authService: AuthService) { super(customerService); }
}
