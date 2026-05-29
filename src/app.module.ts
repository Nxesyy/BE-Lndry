import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [UserModule, OrderModule, AuthModule, AdminModule, BcryptModule, PrismaModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
