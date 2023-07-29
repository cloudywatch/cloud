import { Module, forwardRef } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Journal} from './journal.entity';
import {CommonModule} from '../common/common.module';
import { LedgerModule } from 'src/ledger/ledger.module';
import { Ledger } from 'src/ledger/ledger.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journal]), TypeOrmModule.forFeature([Ledger]), CommonModule , forwardRef(() => LedgerModule)
  ],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService]
})
export class JournalModule {}
