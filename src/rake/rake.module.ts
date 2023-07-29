import { Module } from '@nestjs/common';
import { RakeController } from './rake.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Rake } from './models/rake.entity';
import { RakeService } from './rake.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rake]), CommonModule, AuthModule
  ],
  exports: [
    RakeService
  ],
  controllers: [RakeController],
  providers: [RakeService]
})
export class RakeModule {}
