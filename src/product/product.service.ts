import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { BaseTransaction } from "../common/BaseTransaction";
import { Product } from 'src/product/models/product.entity';

@Injectable()
export class ProductService extends AbstractService {
    constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {
        super(productRepository);
    }   

}
