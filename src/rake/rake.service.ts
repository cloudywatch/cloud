import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rake } from './models/rake.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@Injectable()
export class RakeService extends AbstractService {
    constructor(@InjectRepository(Rake) private readonly rakeRepository: Repository<Rake>){
        super(rakeRepository);
    }
    // async searchdropdown(conditionsArray= [], relations = []): Promise<any> {               
    //     return this.rakeRepository.find({where: [{system: { id: 2, }}], relations});
    // }
}
