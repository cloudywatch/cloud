import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Ledger } from './ledger.entity';

import { Journal } from 'src/journal/journal.entity';
import {BaseTransaction} from "../common/BaseTransaction";
import { Connection, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class LedgerService extends AbstractService {
    constructor(
        @InjectRepository(Ledger) private readonly ledgerRepository: Repository<Ledger>,
        private readonly baseTransaction: BaseTransaction
        ){ super(ledgerRepository ); }

        async delete(id: number): Promise<any> {   
            const myCallback = async function(queryRunner: QueryRunner) {               
                const journalDeletedResult = await queryRunner.manager.delete(Journal, {ledger: id});
                return await queryRunner.manager.delete(Ledger, {id: id});                
            };
            return  await this.baseTransaction.runTransaction(myCallback);        
        }
        
        async listLedgers(page: number = 1, conditionsArray= {}): Promise<any> {
            let totdr = 0, totcr = 0.0, baltot = 0.0;
            const take = 10;
            let [data, count] = [{}, 0];
    
            [data, count] = await this.ledgerRepository.findAndCount({
                where: conditionsArray,
                order: {
                    'code': 'ASC', 'name': 'ASC',
                },
                take,
                skip: (page - 1) * take,
            });
    
            totdr = await this.ledgerRepository.createQueryBuilder("Ledger")
                .select("SUM(Ledger.debitTotal)", "totldr")
                .getRawOne();
            totdr = Object.values(totdr)[0];
            totcr = await this.ledgerRepository.createQueryBuilder("Ledger")
                .select("SUM(Ledger.creditTotal)", "totlcr")
                .getRawOne();
            totcr = Object.values(totcr)[0];
            baltot = totdr - totcr;
            console.log('somak dekho rey', totdr);
            
            console.log('somak etna : ',totdr, totcr, baltot);
            
            // console.log('somak etna : ',Object.values(totdr)[0], Object.values(totcr)[0], baltot);
            // data.push(totqty, totamt, avgrate);
            // data = { ...data, totqty, totamt, avgrate };
    
            return {
                data: data,
                meta: {
                    count, totdr, totcr, baltot,
                    page,
                    pages: Math.ceil(count / take)
                }
            }
        }
}
