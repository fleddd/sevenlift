import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards
} from '@nestjs/common';
import { TrainingDayService } from './training-day.service';
import { TrainingDayDto, UpdateTrainingDayDto } from './dto/training-day.dto';
import { JwtAuthGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('training-days')
export class TrainingDayController {
	constructor(private readonly trainingDayService: TrainingDayService) {}

	@Post()
	create(@Body() createTrainingDayDto: TrainingDayDto) {
		return this.trainingDayService.create(createTrainingDayDto);
	}

	@Get()
	getDays(@Query('id') id: string, @Query('programId') programId: string) {
		return this.trainingDayService.getDaysWithQuery(id, programId);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateTrainingDayDto: UpdateTrainingDayDto
	) {
		return this.trainingDayService.update(id, updateTrainingDayDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.trainingDayService.delete(id);
	}
}
