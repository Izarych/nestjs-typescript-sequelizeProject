import {forwardRef, Module} from '@nestjs/common';
import { TextBlockService } from './text-block.service';
import { TextBlockController } from './text-block.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {TextBlock} from "./text-block.model";
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../files/files.module";


@Module({
  providers: [TextBlockService],
  controllers: [TextBlockController],
  imports: [
      SequelizeModule.forFeature([TextBlock]),
      forwardRef(() => AuthModule),
      FilesModule

  ],
  exports: [
      TextBlockService
  ]
})
export class TextBlockModule {}
