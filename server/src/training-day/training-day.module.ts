import { Module } from '@nestjs/common';
import { TrainingDayService } from './training-day.service';
import { TrainingDayController } from './training-day.controller';

@Module({
	controllers: [TrainingDayController],
	providers: [TrainingDayService]
})
export class TrainingDayModule {}
