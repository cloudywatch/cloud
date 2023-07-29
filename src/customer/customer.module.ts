import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Customer } from './models/customer.entity';
import { CustomerService } from './customer.service';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]), CommonModule, AuthModule
  ],
  exports: [
    CustomerService
  ],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
