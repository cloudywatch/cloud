import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {BaseTransaction} from "src/common/BaseTransaction";
@Module({
    imports: [
        JwtModule.register({
            secret: 'secret',
            signOptions: {expiresIn: '1d'}
        })
    ],
    providers: [BaseTransaction],
    exports:[ JwtModule, BaseTransaction ]
})
export class CommonModule {}
