import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { System } from './models/system.entity';
import { SystemService } from './system.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([System]), CommonModule, AuthModule
  ],
  exports: [
    SystemService
  ],
  controllers: [SystemController],
  providers: [SystemService]
})
export class SystemModule {}
