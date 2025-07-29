import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class TrainingDayDto {
	@IsNotEmpty()
	programId: string;

	@IsNotEmpty()
	@IsNumber()
	@IsPositive({ message: 'The day index should be positive number.' })
	@Min(1, { message: 'The minimum day index is 1 which is Monday.' })
	@Max(7, { message: 'The maximum day index is 7 which is Sunday.' })
	dayIndex: number;

	@IsNotEmpty({ message: 'Training day should have a title.' })
	title: string;
}

export class UpdateTrainingDayDto extends PartialType(TrainingDayDto) {}
