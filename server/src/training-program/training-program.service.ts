import { Injectable } from '@nestjs/common';
import {
	TrainingProgramDto,
	UpdateTrainingProgramDto
} from './dto/training-program.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgramWithDataDto } from './dto/create-program.dto';

@Injectable()
export class TrainingProgramService {
	constructor(private readonly prisma: PrismaService) { }
	async create(userId: string, dto: TrainingProgramDto) {
		return await this.prisma.trainingProgram.create({
			data: {
				name: dto.name,
				folder: {
					connect: { id: dto.folderId }
				},
				user: { connect: { id: userId } }
			},
			select: {
				name: true,
				id: true
			}
		});
	}
	async createProgramWithData(createProgramDto: CreateProgramWithDataDto, folderId: string, userId: string) {
		return await this.prisma.trainingProgram.create({
			data: {
				name: createProgramDto.programName,
				user: {
					connect: { id: userId }
				},
				folder: {
					connect: {
						id: folderId,
						userId: userId
					}
				},
				TrainingDay: {
					create: createProgramDto.trainingDays.map(trainingDay => ({
						dayIndex: trainingDay.dayIndex,
						title: trainingDay.title,
						exercises: {
							create: trainingDay.exercises.map(exercise => ({
								sets: exercise.sets,
								reps: exercise.reps,
								order: exercise.order,
								exercise: {
									connectOrCreate: {
										where: { id: exercise.exercise.id },
										create: {
											id: exercise.exercise.id,
											name: exercise.exercise.name,
											description: exercise.exercise.description,
											userId: userId
										}
									}
								}
							}))
						}
					}))
				}
			},
			include: {
				TrainingDay: {
					include: {
						exercises: {
							include: {
								exercise: true
							}
						}
					}
				}
			}
		});
	}


	async getProgramsWithQuery(id: string, folderId: string) {
		return await this.prisma.trainingProgram.findMany({
			where: {
				OR: [{ id: id }, { folderId: folderId }]
				//id for one program
				//folder for many programs
			},
			select: {
				name: true,
				id: true
			}
		});
	}

	async update(id: string, dto: UpdateTrainingProgramDto) {
		return await this.prisma.trainingProgram.update({
			where: {
				id: id
			},
			data: {
				name: dto.name
			},
			select: {
				name: true,
				id: true
			}
		});
	}

	async delete(programId: string) {
		return await this.prisma.trainingProgram.delete({
			where: {
				id: programId
			},
			select: {
				name: true,
				id: true
			}
		});
	}
}
