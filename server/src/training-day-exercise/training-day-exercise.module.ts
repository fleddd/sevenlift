import { Module } from '@nestjs/common';
import { TrainingDayExerciseService } from './training-day-exercise.service';
import { TrainingDayExerciseController } from './training-day-exercise.controller';

@Module({
	controllers: [TrainingDayExerciseController],
	providers: [TrainingDayExerciseService]
})
export class TrainingDayExerciseModule {}
