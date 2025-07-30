export interface ITrainingProgram {
    id: string
    programName: string;
    trainingDays: ITrainingDay[];
}
export interface ITrainingDay {
    id: string;
    dayIndex: number;
    title: string;
    exercises: ITrainingDayExcercise[];
};

export interface ITrainingDayExcercise {
    sets: number;
    reps: number;
    order: number;
    exercise: IExcercise;
};

export interface IExcercise {
    id: string;
    name: string;
    description: string;
};
