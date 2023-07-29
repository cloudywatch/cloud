import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './models/sector.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@Injectable()
export class SectorService extends AbstractService {
    constructor(@InjectRepository(Sector) private readonly sectorRepository: Repository<Sector>){
        super(sectorRepository);
    }    
}
