import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {TextBlockService} from "./text-block.service";
import {TextBlockDto} from "./dto/text-block.dto";
import {TextBlock} from "./text-block.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('text-block')
export class TextBlockController {
    constructor(private textBlockService: TextBlockService) {
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() createTextBlockDto: TextBlockDto,
           @UploadedFile() image) {
        return this.textBlockService.create(createTextBlockDto, image);
    }

    @Get()
    getAll() {
        return this.textBlockService.getAllBlocks();
    }

    @Get('group/:group')
    getGroupTextBlocks(@Param('group') group: string) {
        return this.textBlockService.getGroupTextBlocks(group);
    }

    // Get по уникальному SearchName
    @Get(':name')
    getTextBlockByName(@Param('name') name: string) {
        return this.textBlockService.getTextBlockBySearchName(name);
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateDto: Partial<TextBlock>) {
        return this.textBlockService.update(id, updateDto);
    }

    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.textBlockService.delete(id);
    }
}
