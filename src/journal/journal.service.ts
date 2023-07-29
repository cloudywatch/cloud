import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Journal } from './journal.entity';
import { startOfDay, endOfDay, format, subDays, addDays } from 'date-fns';
import { LedgerService } from 'src/ledger/ledger.service';
import { Ledger } from 'src/ledger/ledger.entity';
import {BaseTransaction} from "../common/BaseTransaction";
import { Connection, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class JournalService extends AbstractService {
    constructor(
        @InjectRepository(Journal) private readonly journalRepository: Repository<Journal>,
        @InjectRepository(Ledger) private readonly ledgerRepository: Repository<Ledger>,
        private ledgerService: LedgerService,
        private readonly connection: Connection,        
        private readonly baseTransaction: BaseTransaction
        ) {
        super(journalRepository);
    }

    async listJournals(page: number = 1, ledgerid = '', relations = [], frmdate= '', todate= ''): Promise<any> {   
        let debitbal = 0, creditbal = 0, netbal = 0;        
        const take = 10;
        let [data, count] = [{}, 0];        
        if (ledgerid !== '') {            
            [data, count] = await this.journalRepository.findAndCount({
                where: [{
                    ledger: [{id: parseInt(ledgerid)}],
                    date: Between(
                        new Date(frmdate === '' ? subDays(new Date(), 60) : frmdate) , 
                        new Date(todate === '' ? new Date() : todate)
                    )
                }],
                order: {
                    'date': 'ASC',
                },                
                take,
                skip: (page - 1) * take,
                relations
            });
        
            debitbal = await this.journalRepository.createQueryBuilder("Journal") 
            .select("SUM(Journal.amount)", "debittotal")
            .where("Journal.jrtype = :jrtype", { jrtype: 'debit' }) 
            .andWhere("Journal.ledger = :ledger", { ledger: ledgerid })            
            .andWhere(`Journal.date BETWEEN '${new Date(frmdate === '' ? subDays(new Date(), 60) : frmdate).toISOString()}' AND '${new Date(todate === '' ? new Date() : todate).toISOString()}'`)
            .getRawOne();

            creditbal = await this.journalRepository.createQueryBuilder("Journal") 
            .select("SUM(Journal.amount)", "credittotal")
            .where("Journal.jrtype = :jrtype", { jrtype: 'credit' }) 
            .andWhere("Journal.ledger = :ledger", { ledger: ledgerid })            
            .andWhere(`Journal.date BETWEEN '${new Date(frmdate === '' ? subDays(new Date(), 60) : frmdate).toISOString()}' AND '${new Date(todate === '' ? new Date() : todate).toISOString()}'`)
            .getRawOne();            

            const netballedger = await this.ledgerService.findOne([{id: ledgerid}]);
            netbal = netballedger.balance;

            debitbal = Object.values(debitbal)[0];
            creditbal = Object.values(creditbal)[0];

        }
        else {            
            [data, count] = await this.journalRepository.findAndCount({
                where: {                    
                    date: Between(
                        new Date(frmdate === '' ? format(subDays(new Date(), 60), 'yyyy-MM-dd') : frmdate) , 
                        new Date(todate === '' ? format(new Date(), 'yyyy-MM-dd')  : todate)
                                 )
                },
                order: {
                    'date': 'ASC',
                },
                take,
                skip: (page - 1) * take,
                relations
            });            
            
            debitbal = await this.journalRepository.createQueryBuilder("Journal") 
            .select("SUM(Journal.amount)", "debittotal")
            .where("Journal.jrtype = :jrtype", { jrtype: 'debit' })            
            .andWhere(`Journal.date BETWEEN '${new Date(frmdate === '' ? subDays(new Date(), 60) : frmdate).toISOString()}' AND '${new Date(todate === '' ? new Date() : todate).toISOString()}'`)            
            .getRawOne();

            creditbal = await this.journalRepository.createQueryBuilder("Journal") 
            .select("SUM(Journal.amount)", "credittotal")
            .where("Journal.jrtype = :jrtype", { jrtype: 'credit' })       
            .andWhere(`Journal.date BETWEEN '${new Date(frmdate === '' ? subDays(new Date(), 60) : frmdate).toISOString()}' AND '${new Date(todate === '' ? new Date() : todate).toISOString()}'`)            
            .getRawOne();

            netbal = await this.ledgerRepository.createQueryBuilder("Ledger") 
            .select("SUM(Ledger.balance)", "netallbal")           
            .getRawOne();            

            debitbal = Object.values(debitbal)[0];     creditbal = Object.values(creditbal)[0];
            netbal = Object.values(netbal)[0];
        }        
        return {
            data: data,            
            meta: {
                count, debitbal, creditbal, netbal,
                page,
                pages: Math.ceil(count / take)
            }
        }
    }    

    async balances(ledgerid = '', frmdate= '', todate= ''): Promise<any> {
        let debitbal = 0;  let creditbal = 0;  let netbal = 0; 
        return { debitbal, creditbal, netbal, }
    }

    async searchdropdown(conditionsArray= [], relations = [], querystring = ''): Promise<any> {         
        const result = await this.journalRepository.createQueryBuilder("Journal")
            //.where('ledger.name like :search', { search: `%${querystring}%`}) 
            .leftJoin("Journal.ledger", "ledger")
            //.leftJoinAndSelect('Journal.ledger', 'ledger', 'ledger.code like :search', { search: `%${querystring}%`})
            //.select(["Journal.date", "Journal.jrtype", "Journal.amount", "Journal.ledger.name"])
            .select(["Journal.id", "Journal.date", "Journal.jrtype", "Journal.amount", "Journal.particular", "ledger.name", "ledger.id", "ledger.code"])
            //.addSelect("ledger.name", "ledgername")
            //.where('ledger.code like :search', { search: `%${querystring}%`}) 
            .where('ledger.code like :search', { search: `%${querystring}%`}) 
            // .andWhere('Journal.removed = :status', { status: false})
            // .andWhere('ledger.removed = :status', { status: false})
            .getMany();        
        return result;            
    }

    async create(data): Promise<any> {        
        const { ledger, jrtype, amount } = data;
        const ledgertoupdate = await this.ledgerService.findOne([{id: ledger}]);
        let { balance, debitTotal, creditTotal } = ledgertoupdate;
        if(jrtype == 'debit'){
            balance = parseFloat(balance.toString()) + parseFloat(amount);
            debitTotal = parseFloat(debitTotal) + parseFloat(amount.toString());            
        }
        else{
            balance = parseFloat(balance.toString()) - parseFloat(amount);     
            creditTotal = parseFloat(creditTotal) + parseFloat(amount.toString());       
        }        
        const myCallback = async function(queryRunner: QueryRunner) {            
            const jrnlSaved = await queryRunner.manager.save(Journal, data);
            const ledgerupdated = await queryRunner.manager.update(Ledger, { id: ledger }, { balance, debitTotal, creditTotal });
            return jrnlSaved;
        };
        return  await this.baseTransaction.runTransaction(myCallback);
    }

    async delete(id: number): Promise<any> {
        const jrnltoupdate = await this.journalRepository.findOne({where: {id: id}, relations: ['ledger']});        
        const { ledger, jrtype, amount } = jrnltoupdate;        
        const ledgertoupdate = await this.ledgerService.findOne([{id: ledger.id}]);        
        let { balance, debitTotal, creditTotal } = ledgertoupdate;

        if(jrtype == 'debit'){
            balance = parseFloat(balance) - parseFloat(amount.toString());
            debitTotal = parseFloat(debitTotal) - parseFloat(amount.toString());
        }
        else{
            balance = parseFloat(balance) + parseFloat(amount.toString());
            creditTotal = parseFloat(creditTotal) - parseFloat(amount.toString());
        }        

        const myCallback = async function(queryRunner: QueryRunner) {               
            const ledgerupdated = await queryRunner.manager.update(Ledger, { id: ledger.id }, { balance, debitTotal, creditTotal });
            const journalDeletedResult = await queryRunner.manager.delete(Journal, {id: id});
            return journalDeletedResult;
        };
        return  await this.baseTransaction.runTransaction(myCallback);        
    }

}
