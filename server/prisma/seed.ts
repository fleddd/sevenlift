import { PrismaClient } from '../generated/prisma';
import defaultExercises from './basic_gym_exercises.json'

const prisma = new PrismaClient();


async function seedDefaultExercises() {
    console.log('Starting exercise seeding...');

    // Delete all existing global exercises
    await prisma.exercise.deleteMany({
        where: { userId: null }
    });

    // Create all default exercises in one operation
    const { count } = await prisma.exercise.createMany({
        data: defaultExercises.map(exercise => ({
            ...exercise,
            // userId: null is implicit for global exercises
        })),
        skipDuplicates: true // Optional safety
    });

    console.log(`Seeded ${count} default exercises`);
}

async function main() {
    await seedDefaultExercises();
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });