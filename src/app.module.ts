import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { ClientModule } from './client/client.module';
import { SectorModule } from './sector/sector.module';
import { CustomerModule } from './customer/customer.module';
import { SystemModule } from './system/system.module';
import { RakeModule } from './rake/rake.module';
import { LedgerModule } from './ledger/ledger.module';
import { JournalModule } from './journal/journal.module';
import { ProductModule } from './product/product.module';
import { RakeStatusModule } from './rakeStatus/rakeStatus.module';
import { GrnModule } from './grn/grn.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        // require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false // This line will fix new error
      },
    }),
    UserModule,
    AuthModule,
    CommonModule,
    RoleModule,
    ClientModule,
    SectorModule,
    CustomerModule,
    SystemModule,
    RakeModule,
    ProductModule,
    RakeStatusModule,
    GrnModule,
    // LedgerModule,
    // JournalModule,
    // SaleModule,    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
