import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Client } from './models/client.entity';
import { ClientService } from './client.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]), CommonModule, AuthModule
  ],
  exports: [
    ClientService
  ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}
