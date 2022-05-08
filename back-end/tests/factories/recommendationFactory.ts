import { prisma } from "../../src/database";
import { faker } from '@faker-js/faker';

export async function create(score = 0) {
    const body = {
        name: "Não - Tim Bernardes",
        youtubeLink: "https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes"
    }

    await prisma.recommendation.create({
        data: {
            ...body,
            score
        }
    });

    return body.name;
}

export async function createRandom(quantity = 1, score = 0) {
    for (let i = 0; i < quantity; i++) {
        const body = {
            name: faker.name.firstName(),
            youtubeLink: "https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes"
        }

        await prisma.recommendation.create({
            data: {
                ...body,
                score
            }
        });
    }
}

export function createRandomBody() {
    return {
        name: faker.name.firstName(),
        youtubeLink: "https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes"
    }
}