import { Injectable } from '@nestjs/common';
import { ExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExercisesService {
	constructor(private readonly prisma: PrismaService) {}

	async create(userId: string, dto: ExerciseDto) {
		return await this.prisma.exercise.create({
			data: {
				name: dto.name,
				description: dto.description,
				...(userId && { user: { connect: { id: userId } } })
			},
			select: {
				name: true,
				description: true,
				id: true
			}
		});
	}

	async getAllGlobalExercises(userId: string) {
		return await this.prisma.exercise.findMany({
			where: {
				userId: null
			},
			select: {
				name: true,
				description: true,
				id: true
			}
		});
	}

	async getExercisesWithQuery(userId: string, exerciseId: string) {
		return await this.prisma.exercise.findMany({
			where: {
				OR: [{ id: exerciseId }, { userId: userId }]
			},
			select: {
				name: true,
				description: true,
				id: true
			}
		});
	}

	async update(userId: string, dto: UpdateExerciseDto) {
		return await this.prisma.exercise.update({
			where: {
				userId,
				id: dto.id
			},
			data: {
				name: dto.name,
				description: dto.description
			},
			select: {
				name: true,
				description: true,
				id: true
			}
		});
	}

	async delete(userId: string, exerciseId: string) {
		return await this.prisma.exercise.delete({
			where: {
				userId,
				id: exerciseId
			},
			select: {
				name: true,
				description: true,
				id: true
			}
		});
	}
}
