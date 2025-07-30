import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query
} from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import {
	TrainingProgramDto,
	UpdateTrainingProgramDto
} from './dto/training-program.dto';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('training-programs')
export class TrainingProgramController {
	constructor(
		private readonly trainingProgramService: TrainingProgramService
	) {}

	@Post()
	create(
		@CurrentUser() user: User,
		@Body() trainingProgramDto: TrainingProgramDto
	) {
		return this.trainingProgramService.create(user.id, trainingProgramDto);
	}

	@Get()
	get(@Query('id') id: string, @Query('folderId') folderId) {
		return this.trainingProgramService.getProgramsWithQuery(id, folderId);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateTrainingProgramDto: UpdateTrainingProgramDto
	) {
		return this.trainingProgramService.update(id, updateTrainingProgramDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.trainingProgramService.delete(id);
	}
}
