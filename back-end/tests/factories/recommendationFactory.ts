import { prisma } from "../../src/database";

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