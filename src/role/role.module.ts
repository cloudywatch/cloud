import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Role} from './role.entity';
import {CommonModule} from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]) , CommonModule
  ],
  providers: [RoleService],
  controllers: [RoleController]
})
export class RoleModule {}
