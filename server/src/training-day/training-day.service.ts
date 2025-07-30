import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { TrainingDayDto, UpdateTrainingDayDto } from './dto/training-day.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrainingDayService {
	constructor(private readonly prisma: PrismaService) {}
	async create(dto: TrainingDayDto) {
		const program = await this.prisma.trainingProgram.findUnique({
			where: { id: dto.programId }
		});

		if (!program) {
			throw new NotFoundException('Training Program not found');
		}
		return await this.prisma.trainingDay.create({
			data: {
				title: dto.title,
				dayIndex: dto.dayIndex,
				trainingProgram: {
					connect: {
						id: dto.programId
					}
				}
			},
			select: {
				id: true,
				title: true,
				dayIndex: true,
				exercises: {
					select: {
						reps: true,
						sets: true,
						order: true,
						id: true
					}
				}
			}
		});
	}

	async getDaysWithQuery(dayId: string, programId: string) {
		const program = await this.prisma.trainingProgram.findUnique({
			where: { id: programId }
		});
		if (!program) {
			throw new BadRequestException('There is no such training program.');
		}
		return await this.prisma.trainingDay.findMany({
			where: {
				OR: [{ id: dayId }, { trainingProgramId: programId }]
				//id for one day
				//folder for many days
			},
			select: {
				id: true,
				title: true,
				dayIndex: true,
				exercises: {
					select: {
						reps: true,
						sets: true,
						order: true,
						id: true,
						exercise: {
							select: {
								name: true,
								description: true,
								id: true
							}
						}
					}
				}
			}
		});
	}

	async update(dayId: string, dto: UpdateTrainingDayDto) {
		return await this.prisma.trainingDay.update({
			where: {
				id: dayId
			},
			data: {
				title: dto.title,
				dayIndex: dto.dayIndex
			},
			select: {
				id: true,
				title: true,
				dayIndex: true,
				exercises: {
					select: {
						reps: true,
						sets: true,
						order: true,
						id: true
					}
				}
			}
		});
	}

	async delete(dayId: string) {
		return await this.prisma.trainingDay.delete({
			where: {
				id: dayId
			},
			select: {
				id: true,
				title: true,
				dayIndex: true,
				exercises: {
					select: {
						reps: true,
						sets: true,
						order: true,
						id: true
					}
				}
			}
		});
	}
}
