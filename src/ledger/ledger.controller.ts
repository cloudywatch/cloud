import { Controller, Get, Post, Patch, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { Ledger } from './ledger.entity';
import { Request, Response } from 'express';
import { AbstractController } from 'src/common/abstract.controller';
import { JournalService } from 'src/journal/journal.service';

@Controller('ledger')
export class LedgerController extends AbstractController {
    constructor(
        private ledgerService: LedgerService,
        private journalService: JournalService
        ) { super(ledgerService); }

    // @Post('create')
    // async createChild(@Body() body, @Res() response: Response) {        
    //     //super.create({balance: 0, removed: false, ...body}, response);
    //     super.create({...body}, response);
    // }

    @Get('list')
    async listledgers(
        @Query('page') current_page: number = 1,
        @Query('ledgerId') ledger_id: string = '',        
        @Req() request: Request,
        @Res() response: Response,        
    ) {
        // const allquery = {...request.query};
        // request.query = {...allquery, conditions: [ {id: '1'},]};
        
        const fields = request.query.jsonData? JSON.parse(request.query.jsonData.toString()) : '';
        let conditionsArray= {};
        if(fields.ledger!==undefined && fields.ledger!== '') conditionsArray= [ {id: fields.ledger},];
        // request.query = {...request.query, conditions: [ {id: fields.ledger},]};
        console.log('hey giri', {...request.query}, fields.ledger);
        // super.list(current_page, request, response, {'code': 'ASC', 'name': 'ASC'});        

        try {            
            const output = await this.ledgerService.listLedgers(current_page, conditionsArray);
            const { data, meta } = output;
            const { count, page, pages, totdr, totcr, baltot, } = meta;
            data.push( totdr, totcr, baltot );
            const pagination = { page, pages, count };            
            if (count >= 0) {
                console.log(`somak123+ shyamnagar here...`+ JSON.stringify(data) + JSON.stringify(pagination));
                return response.status(200).json({
                    success: true,
                    result: data,
                    pagination,                    
                    message: 'Successfully found all documents',
                });
            } else {
                return response.status(203).json({
                    success: false,
                    result: [],
                    pagination,
                    message: 'Collection is Empty',
                });
            }
        } catch (err) {
            console.log('somak my dear:',err);
            return response.status(500).json({
                success: false,
                result: [],
                message: 'Oops there is an Error',
                error: err,
            });
        }

    }

    @Delete('delete/:id')
    async deleteLedger(@Req() request: Request, @Res() response: Response) {         
        const result = await this.ledgerService.delete(parseInt(request.params.id));
        try {            
            if (!result) {
                return response.status(404).json({
                    success: false,
                    result: null,
                    message: 'No document found by this id: ' + request.params.id,
                });
            } else {
                return response.status(200).json({
                    success: true,
                    result,
                    message: 'Successfully Deleted the document by id: ' + request.params.id,
                });
            }
        } catch (err) {
            return response.status(500).json({
                success: false,
                result: null,
                message: 'Oops there is an Error',
                error: err,
            });
        }
    }
}
