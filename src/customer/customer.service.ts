import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './models/customer.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@Injectable()
export class CustomerService extends AbstractService {
    constructor(@InjectRepository(Customer) private readonly customerRepository: Repository<Customer>){
        super(customerRepository);
    }    
}
