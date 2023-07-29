import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from './models/system.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@Injectable()
export class SystemService extends AbstractService {
    constructor(@InjectRepository(System) private readonly systemRepository: Repository<System>){
        super(systemRepository);
    }    
}
