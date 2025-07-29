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
import { ExercisesService } from './exercises.service';
import { ExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { User } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
	constructor(private readonly exercisesService: ExercisesService) {}

	@Post()
	create(@CurrentUser() user: User, @Body() createExerciseDto: ExerciseDto) {
		return this.exercisesService.create(user.id, createExerciseDto);
	}

	@Get()
	getAllGlobalExercises(@CurrentUser() user: User) {
		return this.exercisesService.getAllGlobalExercises(user.id);
	}
	@Get()
	getExercises(
		@Query('exerciseId') exerciseId: string,
		@Query('userId') userId: string
	) {
		return this.exercisesService.getExercisesWithQuery(userId, exerciseId);
	}

	@Patch(':id')
	update(
		@CurrentUser() user: User,
		@Body() updateExerciseDto: UpdateExerciseDto
	) {
		return this.exercisesService.update(user.id, updateExerciseDto);
	}

	@Delete(':id')
	remove(@CurrentUser() user: User, @Param('id') exerciseId: string) {
		return this.exercisesService.delete(user.id, exerciseId);
	}
}
