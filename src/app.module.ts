import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BcryptModule } from './bcrypt/bcrypt.module';

@Module({
  imports: [UserModule, OrderModule, AuthModule, AdminModule, BcryptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
