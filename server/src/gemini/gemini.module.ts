import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { TrainingProgramService } from 'src/training-program/training-program.service';
import { FoldersService } from 'src/folders/folders.service';

@Module({
	controllers: [GeminiController],
	providers: [
		GeminiService,
		TrainingProgramService,
		FoldersService
	]
})
export class GeminiModule { }
