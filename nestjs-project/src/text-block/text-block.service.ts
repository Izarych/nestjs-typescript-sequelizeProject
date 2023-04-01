import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TextBlock} from "./text-block.model";
import {TextBlockDto} from "./dto/text-block.dto";
import {FilesService} from "../files/files.service";

@Injectable()
export class TextBlockService {
    constructor(@InjectModel(TextBlock) private textBlockRepository: typeof TextBlock,
                private filesService: FilesService) {
    }

    async create(createTextBlockDto: TextBlockDto, image) {
        const fileName = await this.filesService.createFile(image);
        const textBlock = await this.textBlockRepository.create({...createTextBlockDto, image: fileName})
        await this.filesService.addFileToDB(fileName, 'TextBlock', textBlock.id);
        return textBlock;
    }

    async getAllBlocks() {
        return await this.textBlockRepository.findAll()
    }

    async getGroupTextBlocks(group: string) {
        return await this.textBlockRepository.findAll({where: {group: group}})
    }

    async getTextBlockBySearchName(searchName: string) {
        return await this.textBlockRepository.findOne({where: {searchName: searchName}})
    }

    async update(id: number, dto: Partial<TextBlock>) {
        const textBlock = await this.textBlockRepository.findByPk(id);
        if (!textBlock) {
            throw new NotFoundException(`Блок с Id: ${id} не найден`)
        }
        return await textBlock.update(dto)
    }

    async delete(id: number) {
        const textBlock = await this.textBlockRepository.findByPk(id);
        await this.filesService.clearEssence(id)
        await textBlock.destroy();
        return {
            message: `Блок с Id: ${id} был успешно удален`
        }
    }
}
