import { Module } from '@nestjs/common';
import { TrainingProgramService } from './training-program.service';
import { TrainingProgramController } from './training-program.controller';

@Module({
	controllers: [TrainingProgramController],
	providers: [TrainingProgramService]
})
export class TrainingProgramModule {}
