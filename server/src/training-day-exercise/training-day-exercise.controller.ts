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
import { TrainingDayExerciseService } from './training-day-exercise.service';
import {
	TrainingDayExerciseDto,
	UpdateTrainingDayExerciseDto
} from './dto/training-day-exercise.dto';
import { JwtAuthGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('training-day-exercises')
export class TrainingDayExerciseController {
	constructor(
		private readonly trainingDayExerciseService: TrainingDayExerciseService
	) {}

	@Post()
	create(
		@Query('exerciseId') exerciseId,
		@Query('trainingDayId') trainingDayId,
		@Body() trainingDayExerciseDto: TrainingDayExerciseDto
	) {
		return this.trainingDayExerciseService.create(
			exerciseId,
			trainingDayId,
			trainingDayExerciseDto
		);
	}

	@Get()
	getTrainingDayExercises(
		@Query('trainingDayExerciseId') trainingDayExerciseId,
		@Query('trainingDayId') trainingDayId
	) {
		return this.trainingDayExerciseService.getTrainingDayExercisesWithQuery(
			trainingDayExerciseId,
			trainingDayId
		);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateTrainingDayExerciseDto: UpdateTrainingDayExerciseDto
	) {
		return this.trainingDayExerciseService.update(
			id,
			updateTrainingDayExerciseDto
		);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.trainingDayExerciseService.delete(id);
	}
}
