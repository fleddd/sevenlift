import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FolderDto, UpdateFolderDto } from './dto/folder.dto';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
	constructor(private readonly foldersService: FoldersService) {}

	@Post()
	async create(@CurrentUser() user: User, @Body() createFolderDto: FolderDto) {
		return await this.foldersService.create(user.id, createFolderDto);
	}

	@Get()
	getAll(@CurrentUser() user: User) {
		return this.foldersService.getAllByUserId(user.id);
	}

	@Patch(':id')
	update(
		@Param('id') folderId: string,
		@Body() updateFolderDto: UpdateFolderDto
	) {
		return this.foldersService.update(folderId, updateFolderDto);
	}

	@Delete(':id')
	async remove(@Param('id') folderId: string) {
		return this.foldersService.delete(folderId);
	}
}
