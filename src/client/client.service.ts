import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './models/client.entity';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@Injectable()
export class ClientService extends AbstractService {
    constructor(@InjectRepository(Client) private readonly clientRepository: Repository<Client>){
        super(clientRepository);
    }

    // async paginate(page=1, relations = []): Promise<PaginatedResult> {        
    //     const {data, meta} = await super.paginate(page, {} ,relations);
    //     return { data, meta }
    // }    
}
