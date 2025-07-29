import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, Max, Min } from 'class-validator';

export class TrainingDayExerciseDto {
	id: string;

	@Min(1)
	@Max(50, {
		message: 'There is no way you are going to do more than 50 sets...'
	})
	@IsNumber()
	sets: number;

	@Min(1)
	@Max(99, { message: 'There is no way you are going to do 99 reps...' })
	@IsNumber()
	reps: number;

	@Min(1)
	@Max(99)
	@IsNumber()
	order: number;
}

export class UpdateTrainingDayExerciseDto extends PartialType(
	TrainingDayExerciseDto
) {}
