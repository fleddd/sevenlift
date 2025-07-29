export class CreateProgramWithDataDto {
	programName: string;
	trainingDays: TTrainingDay[];
}
export type TTrainingDay = {
	id: string;
	dayIndex: number;
	title: string;
	exercises: TExcercises[];
};

export type TExcercises = {
	sets: number;
	reps: number;
	order: number;
	exercise: TExcercise;
};

export type TExcercise = {
	id: string;
	name: string;
	description: string;
};
