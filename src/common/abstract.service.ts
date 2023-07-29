import { Injectable } from '@nestjs/common';
import { Repository, Like, ILike, Between, Not, In, LessThan, MoreThan, LessThanOrEqual, MoreThanOrEqual, Equal, Any, IsNull, } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';
import { startOfDay, endOfDay, format, subDays, addDays } from 'date-fns';

@Injectable()
export abstract class AbstractService {    
    protected constructor(protected readonly repository: Repository<any>){}    

    async all(relations = []): Promise<any> {       
        // return this.repository.find({where: {'removed': false}, relations});
        return this.repository.find({where: {}, relations});        
    }

    async searchdropdown(conditionsArray= [], relations = []): Promise<any> {               
        return this.repository.find({where: conditionsArray, relations});
    }

    async paginate(page: number = 1, conditionsArray= {}, relations = {}, order = {}): Promise<PaginatedResult> {
        const take = 10;
        // console.log('tumpa', JSON.stringify(relations));
        const [data, count] = await this.repository.findAndCount({                
            where: conditionsArray,
            order,            
            take,
            skip: (page-1) * take,
            relations,
        });
        // const [data, count] = await this.repository.findAndCount({
        //     where: conditionsArray,
        //     order,            
        //     take,
        //     skip: (page-1) * take, 
        //     relations: { grn_items: true, },
        // });
        // console.log('tumpa2', JSON.stringify(data), count);
        // where: JSON.parse(Object.values(('{ rast_qty: Not(0), }').replace(/['"]+/g, '')).toString()),
        // where: [{ rast_qty: Not(0), }],
        // where: conditionsArray,
        // console.log('delhiluu..-=>',  page);
        // const [data, count] = await this.repository.findAndCount({});
        // console.log('delhi-=>',  JSON.stringify(data), count, page);
        return {
            data: data,
            meta: {
                count,
                page,
                pages: Math.ceil(count/take)
            }
        }
    }

    // async paginate(page: number = 1, relations = [], order = {}): Promise<PaginatedResult> {
    //     const take = 10;        
    //     // const [data, count] = await this.repository.findAndCount({
    //     //     // where: {'removed': false},
    //     //     // order,
    //     //     take,
    //     //     skip: (page-1) * take,
    //     //     // relations
    //     // }); 
    //     const [data, count] = await this.repository.findAndCount({
    //         //     // where: {'removed': false},
    //     //     // order,
    //     //     take,
    //     //     skip: (page-1) * take,
    //     //     // relations
    //     });
    //     console.log('delhi',  JSON.stringify(data), count);       
    //     return {
    //         data: data,
    //         meta: {
    //             count,
    //             page,
    //             pages: Math.ceil(count/take)
    //         }
    //     }
    // }

    async create(data): Promise<any> {
        return this.repository.save(data);
    }

    async findOne(condition = [], relations = []): Promise<any> {        
        return this.repository.findOne({where: condition, relations});        
    }

    async update(id: number, data): Promise<any> {
        return this.repository.update(id, data);
    }

    async updateNonDeleted(condition: {}, data): Promise<any> {        
        return this.repository.update(condition, data);
    }

    async delete(id: number): Promise<any> {
        return this.repository.delete(id);
    }
}
