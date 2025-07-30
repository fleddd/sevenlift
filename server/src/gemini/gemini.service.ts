import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgramWithDataDto } from '../training-program/dto/create-program.dto';
import { PromptDto } from './dto/prompt.dto';
import { TrainingProgramService } from 'src/training-program/training-program.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { globalExercises } from './exercises.txt';

@Injectable()
export class GeminiService {
	private genAI: GoogleGenerativeAI;
	constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly trainingProgramService: TrainingProgramService,
	) {
		const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
		this.genAI = new GoogleGenerativeAI(apiKey);
	}

	async generateProgram(userId: string, promptRequest: PromptDto) {
		try {
			const geminiModel = this.configService.getOrThrow('GEMINI_MODEL');
			const model = this.genAI.getGenerativeModel({ model: geminiModel, generationConfig: { temperature: 0.3 } });

			const prompt = `
				You are a professional fitness trainer AI that creates structured workout programs. 

			INSTRUCTIONS:
			1. Generate a training program based EXCLUSIVELY on the user's request and available exercises
			2. Use ONLY the exercises from the provided list - never invent new ones
			3. Follow the JSON format precisely
			4. Maintain proper exercise order and day numbering

			USER REQUEST:
			${promptRequest.prompt}

			AVAILABLE EXERCISES (ONLY USE THESE):
			${globalExercises}

			STRICT OUTPUT REQUIREMENTS:
		- Program must have 1-7 training days (dayIndex 1-7)
		- Each exercise must have a UNIQUE order number (sequential starting from 1 within each day)
		- Never repeat exercise IDs in the same day
		- Order numbers must be consecutive (1, 2, 3...) with no gaps
		- Include all required fields in the exact JSON structure shown

			OUTPUT FORMAT (STRICT JSON):
			{
				"programName": "string (creative, descriptive name)",
				"trainingDays": [
					{
						"title": "string (descriptive day title)",
						"dayIndex": number (1-7), 
						"exercises": [
							{
								"exercise": {
									"id": "string (must match provided IDs)",
									"name": "string",
									"description": "string"
								},
								"sets": number (typically 1-6),
								"reps": number (typically 1-15),
								"order": number (unique within day, start from 1)
							}
						]
					}
				]
			}
			`;
			const result = await model.generateContent(prompt);
			const textResponse = result.response.text();
			try {
				const generatedProgram: CreateProgramWithDataDto = JSON.parse(textResponse.split('\n').slice(1, -1).join('\n'));
				this.createProgramInDb(userId, generatedProgram);
			} catch (e) {
				throw new BadGatewayException(
					"Server couldn't generate or parse a new program. Please try again."
				);
			}
		}
		catch (error) {
			throw new BadGatewayException(
				"Server couldn't generate or parse a new program. Please try again."
			);
		}
	}
	private async getOrCreateAIFolder(userId: string) {
		const AI_FOLDER_NAME = "AI Generated Programs";

		return await this.prisma.folder.upsert({
			where: {
				userId_name: {
					userId,
					name: AI_FOLDER_NAME
				}
			},
			create: {
				userId,
				name: AI_FOLDER_NAME
			},
			update: {}
		});
	}
	private async createProgramInDb(
		userId: string,
		generatedProgram: CreateProgramWithDataDto
	) {
		const folderForCreating = await this.getOrCreateAIFolder(userId)
		await this.trainingProgramService.createProgramWithData(generatedProgram, folderForCreating.id, userId)
	}

}
