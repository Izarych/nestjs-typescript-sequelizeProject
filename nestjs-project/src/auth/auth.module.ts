import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {ProfileModule} from "../profile/profile.module";
import {TextBlockModule} from "../text-block/text-block.module";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
      // Форварды чтобы не было циклической зависимости между модулями
      forwardRef(() => UsersModule),
      forwardRef(() => ProfileModule),
      forwardRef(() => TextBlockModule),
      // Options для JwtModule
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'SECRET',
        signOptions: {
          expiresIn: '24h'
        }
      })
  ],
  exports: [
      AuthService,
      JwtModule
  ]
})
export class AuthModule {}
