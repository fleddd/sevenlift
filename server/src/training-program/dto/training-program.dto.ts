import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class TrainingProgramDto {
	@IsString()
	@IsNotEmpty({ message: 'Training program should have a name.' })
	name: string;

	folderId: string;
}


export class UpdateTrainingProgramDto extends PartialType(TrainingProgramDto) { }
