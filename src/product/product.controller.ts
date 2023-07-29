import { Controller, Get, Post, Patch, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/models/product.entity';
import { Request, Response } from 'express';
import { AbstractController } from 'src/common/abstract.controller';
import { AuthService } from 'src/auth/auth.service';

@Controller('product')
export class ProductController extends AbstractController {
    constructor(private productService: ProductService, private authService: AuthService) { super(productService); }    

}
