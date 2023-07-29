import { Module } from '@nestjs/common';
import { RakeStatusController } from './rakeStatus.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { RakeStatus } from './models/rakeStatus.entity';
import { RakeStatusService } from './rakeStatus.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RakeStatus]), CommonModule, AuthModule
  ],
  exports: [
    RakeStatusService
  ],
  controllers: [RakeStatusController],
  providers: [RakeStatusService]
})
export class RakeStatusModule {}
