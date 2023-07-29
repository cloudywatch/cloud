import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RakeStatus } from './models/rakeStatus.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@Injectable()
export class RakeStatusService extends AbstractService {
    constructor(@InjectRepository(RakeStatus) private readonly rakeStatusRepository: Repository<RakeStatus>){
        super(rakeStatusRepository);
    }    
}
