import { prisma } from "../src/database.js";

async function main() {
    await prisma.recommendation.createMany({
        data: [
            {
                name: 'Não - Tim Bernardes',
                youtubeLink: 'https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes',
                score: 86
            },
            {
                name: 'Falamansa - Xote dos Milagres',
                youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
                score: 121
            }
        ],
        skipDuplicates: true
    });
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });