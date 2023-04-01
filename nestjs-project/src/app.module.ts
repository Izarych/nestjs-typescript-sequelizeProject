import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {User} from "./users/users.model";
import { ProfileModule } from './profile/profile.module';
import {Profile} from "./profile/profile.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {UserRoles} from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import { TextBlockModule } from './text-block/text-block.module';
import {TextBlock} from "./text-block/text-block.model";
import { FilesModule } from './files/files.module';
import {File} from "./files/files.model";
import * as path from 'path';
import {ServeStaticModule} from "@nestjs/serve-static";


// Декоратор @Module, импортируем БД используя Sequelize
@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static')
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port:Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Profile, Role, UserRoles, TextBlock, File],
            autoLoadModels: true
        }),
        UsersModule,
        ProfileModule,
        RolesModule,
        AuthModule,
        TextBlockModule,
        FilesModule
    ]
})

export class AppModule{}