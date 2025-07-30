import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExerciseDto {
	@IsNotEmpty({ message: 'Exercise should have a name.' })
	name: string;

	@Optional()
	description: string | null;
	id: string;
}

export class UpdateExerciseDto extends PartialType(ExerciseDto) {}
