import { Module, forwardRef } from '@nestjs/common';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ledger } from './ledger.entity';
import {CommonModule} from '../common/common.module';
import { JournalModule } from 'src/journal/journal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ledger]) , CommonModule, forwardRef(() => JournalModule)
  ],
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService]
})
export class LedgerModule {}
