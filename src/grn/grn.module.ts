import { Module } from '@nestjs/common';
import { GrnController } from './grn.controller';
import { GrnService } from './grn.service';
import { CommonModule } from "../common/common.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Grn } from "./grn.entity";
import { GrnItem } from "./grn-item.entity";
//import {BaseTransaction} from "./BaseTransaction";
import { RakeModule } from 'src/rake/rake.module';
import { ProductModule } from 'src/product/product.module';
import { RakeStatusModule } from 'src/rakeStatus/rakeStatus.module';

@Module({
    imports: [
        CommonModule, RakeModule, ProductModule, RakeStatusModule,
        TypeOrmModule.forFeature([Grn, GrnItem])
    ],
    controllers: [GrnController],
    providers: [GrnService]
})
export class GrnModule {
}
