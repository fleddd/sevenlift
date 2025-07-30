import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ExercisesModule } from './exercises/exercises.module';
import { FoldersModule } from './folders/folders.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TrainingProgramModule } from './training-program/training-program.module';
import { TrainingDayModule } from './training-day/training-day.module';
import { TrainingDayExerciseModule } from './training-day-exercise/training-day-exercise.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({ isGlobal: true }),
		UsersModule,
		ExercisesModule,
		FoldersModule,
		PrismaModule,
		TrainingProgramModule,
		TrainingDayModule,
		TrainingDayExerciseModule,
		GeminiModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
