import { Module } from '@nestjs/common';
import { SectorController } from './sector.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Sector } from './models/sector.entity';
import { SectorService } from './sector.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sector]), CommonModule, AuthModule
  ],
  exports: [
    SectorService
  ],
  controllers: [SectorController],
  providers: [SectorService]
})
export class SectorModule {}
