import { BadRequestException, Injectable } from '@nestjs/common';
import {
	TrainingDayExerciseDto,
	UpdateTrainingDayExerciseDto
} from './dto/training-day-exercise.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrainingDayExerciseService {
	constructor(private readonly prisma: PrismaService) { }
	async create(
		exerciseId: string,
		trainingDayId: string,
		dto: TrainingDayExerciseDto
	) {
		const exercise = await this.prisma.exercise.findUnique({
			where: { id: exerciseId }
		});
		if (!exercise) {
			throw new BadRequestException("This exercise doesn't exist.");
		}

		const trainingDay = await this.prisma.trainingDay.findUnique({
			where: { id: trainingDayId }
		});
		if (!trainingDay) {
			throw new BadRequestException("This training day doesn't exist.");
		}
		// const existingOrder = await this.prisma.trainingDayExercise.findFirst({
		// 	where: {
		// 		AND: [
		// 			{ trainingDayId },
		// 			{ order: dto.order }
		// 		]
		// 	}
		// });

		// if (existingOrder) {
		// 	throw new BadRequestException(
		// 		`An exercise with order ${dto.order} already exists for this training day.`
		// 	);
		// }

		return await this.prisma.trainingDayExercise.create({
			data: {
				reps: dto.reps,
				sets: dto.sets,
				order: dto.order,
				exercise: {
					connect: {
						id: exerciseId
					}
				},
				trainingDay: {
					connect: {
						id: trainingDayId
					}
				}
			},
			select: {
				exercise: {
					select: {
						name: true,
						description: true,
						id: true
					}
				},
				order: true,
				sets: true,
				reps: true,
				id: true
			}
		});
	}

	async getTrainingDayExercisesWithQuery(
		trainingDayExerciseId: string,
		trainingDayId: string
	) {
		if (!trainingDayExerciseId && !trainingDayId) {
			throw new BadRequestException(
				'Invalid params was sent for getting training day exercises.'
			);
		}
		return await this.prisma.trainingDayExercise.findMany({
			where: {
				OR: [{ id: trainingDayExerciseId }, { trainingDayId: trainingDayId }]
			},
			select: {
				exercise: {
					select: {
						name: true,
						description: true,
						id: true
					}
				},
				order: true,
				sets: true,
				reps: true,
				id: true
			}
		});
	}

	async update(id: string, dto: UpdateTrainingDayExerciseDto) {
		return await this.prisma.trainingDayExercise.update({
			where: {
				id
			},
			data: {
				order: dto.order,
				sets: dto.sets,
				reps: dto.reps
			},
			select: {
				exercise: {
					select: {
						name: true,
						description: true,
						id: true
					}
				},
				order: true,
				sets: true,
				reps: true,
				id: true
			}
		});
	}

	async delete(id: string) {
		return await this.prisma.trainingDayExercise.delete({
			where: {
				id
			},
			select: {
				exercise: {
					select: {
						name: true,
						description: true,
						id: true
					}
				},
				order: true,
				sets: true,
				reps: true,
				id: true
			}
		});
	}
}
