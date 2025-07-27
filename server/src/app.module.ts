import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {

}
