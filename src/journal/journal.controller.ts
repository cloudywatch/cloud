import { Controller, Get, Post, Patch, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { JournalService } from './journal.service';
import { Journal } from './journal.entity';
import { Request, Response } from 'express';
import { AbstractController } from 'src/common/abstract.controller';
import { Repository, Like, Between } from 'typeorm';
import { LedgerService } from 'src/ledger/ledger.service';
import { startOfDay, endOfDay, format, subDays, addDays } from 'date-fns';

@Controller('journal')
export class JournalController extends AbstractController {
    constructor(
        private journalService: JournalService,
        private ledgerService: LedgerService
    ) { super(journalService); }

    @Post('create')
    async createChild(@Body() body, @Res() response: Response) {
        try {
            const result = await this.journalService.create(body);
            return response.status(200).json({
                success: true,
                result,
                message: 'Successfully Created the document in Model ',
            });
        } catch (err) {
            if (err.name == 'ValidationError') {
                return response.status(400).json({
                    success: false,
                    result: null,
                    message: 'Required fields are not supplied',
                    error: err,
                });
            } else {
                return response.status(500).json({
                    success: false,
                    result: null,
                    message: 'Oops there is an Error',
                    error: err,
                });
            }
        }
    }

    @Get('list')
    async listJournals(
        @Query('page') current_page: number = 1,
        @Query('ledgerId') ledger_id: string = '',
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            const relationsArray = request.query.relations
                ? request.query.relations.toString().split(',')
                : [];
            console.log('somak control here shyamnagarsss1111...');
            const fields = request.query.jsonData ? JSON.parse(request.query.jsonData.toString()) : '';
            console.log('somak control here shyamnagarsss2222...');
            //const fieldsobj = fields.frmdate ;
            console.log('somak mygod00: ', fields.ledger, ledger_id);
            //console.log(`somak${ledger_id}.relationsArray..`+relationsArray);
            //if(!(fields.ledger==='') || fields.ledger!==undefined) ledger_id= fields.ledger;
            if (fields.ledger !== undefined) ledger_id = fields.ledger;
            console.log('somak mygod0011: ', fields.ledger, ledger_id);
            console.log('somak mygod0022: ', ledger_id);
            const output = await this.journalService.listJournals(current_page, ledger_id, relationsArray, fields.frmdate, fields.todate);
            const { data, meta } = output;
            const { count, page, pages, debitbal, creditbal, netbal } = meta;
            data.push(debitbal, creditbal, netbal);
            const pagination = { page, pages, count };
            // console.log('data is', JSON.stringify(debitbal) );
            if (count >= 0) {
                console.log(`somak123+ is${ledger_id} shyamnagar here...` + JSON.stringify(data) + JSON.stringify(pagination));
                return response.status(200).json({
                    success: true,
                    result: data,
                    pagination,
                    // debitbal,                
                    message: 'Successfully found all documents',
                });
            } else {
                return response.status(203).json({
                    success: false,
                    result: [],
                    pagination,
                    // debitbal,               
                    message: 'Collection is Empty',
                });
            }
        } catch (err) {
            console.log('somak my dear:', err);
            return response.status(500).json({
                success: false,
                result: [],
                message: 'Oops there is an Error',
                error: err,
            });
        }
    }

    @Get('balances')
    async balances(
        @Query('page') current_page: number = 1,
        @Query('ledgerId') ledger_id: string = '',
        @Req() request: Request,
        @Res() response: Response
    ) {
        try {
            console.log('somak balances control here shyamnagarsss1111...');
            const fields = request.query.jsonData ? JSON.parse(request.query.jsonData.toString()) : '';
            console.log('somak balances control here shyamnagarsss2222...');
            console.log('somak balances mygod00: ', fields.ledger, ledger_id);
            if (fields.ledger !== undefined) ledger_id = fields.ledger;
            console.log('somak balances mygod0011: ', fields.ledger, ledger_id);
            const output = await this.journalService.balances(ledger_id, fields.frmdate, fields.todate);
            const { debitbal, creditbal, netbal } = output;
            console.log('data balances is', JSON.stringify(debitbal));
            if (debitbal !== undefined) {
                console.log(`somak123 balances is${ledger_id} shyamnagar here...` + JSON.stringify(debitbal));
                return response.status(200).json({
                    success: true,
                    result: [],
                    debitbal,
                    creditbal,
                    netbal,
                    message: 'Successfully found all documents',
                });
            } else {
                return response.status(203).json({
                    success: false,
                    result: [],
                    debitbal,
                    creditbal,
                    netbal,
                    message: 'Collection is Empty',
                });
            }
        } catch (err) {
            console.log('somak my dear:', err);
            return response.status(500).json({
                success: false,
                result: [],
                message: 'Oops there is an Error',
                error: err,
            });
        }
    }

    @Get('search')
    async search(@Req() request: Request, @Res() response: Response) {
        if (request.query.q === undefined || request.query.q.toString().trim() === '') {
            return response
                .status(202)
                .json({
                    success: false,
                    result: [],
                    message: 'No document found by this request',
                })
                .end();
        }
        const relationsArray = request.query.relations
            ? request.query.relations.toString().split(',')
            : [];

        const fieldsArray = request.query.fields
            ? request.query.fields.toString().split(',')
            : ['name', 'surname', 'birthday'];

        const fields = { $or: [] };

        for (const field of fieldsArray) {
            //fields.$or.push({ [field]: { $regex: new RegExp(request.query.q.toString(), 'i') } });            
            fields.$or.push({ [field]: Like(`%${request.query.q.toString().trim()}%`), removed: false });
        }

        try {
            let results = await this.journalService.searchdropdown(fields.$or, relationsArray, request.query.q.toString().trim());

            const labels = (results) => {
                return results.map((x) => {
                    const { ledger, ...data } = x;
                    return x = { ledgernm: ledger.name, ledgercd: ledger.code, ledger, ...data };
                });
            };

            if (results.length >= 1) {
                //console.log('success......');   
                return response.status(200).json({
                    success: true,
                    result: labels(results),
                    message: 'Successfully found all documents',
                });
            } else {
                //console.log('failure......');   
                return response
                    .status(202)
                    .json({
                        success: false,
                        result: [],
                        message: 'No document found by this request',
                    })
                    .end();
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

    @Delete('delete/:id')
    async deleteJournal(@Req() request: Request, @Res() response: Response) {
        try {
            const result = await this.journalService.delete(parseInt(request.params.id));
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
