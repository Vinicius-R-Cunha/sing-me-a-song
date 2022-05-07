import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";
import * as recommendationFactory from "../tests/factories/recommendationFactory.js";

describe("POST /recommendations", () => {
    beforeEach(truncateRecommendations);
    afterAll(disconnect);

    it("should return 201 given a valid body", async () => {
        const body = {
            name: "Não - Tim Bernardes",
            youtubeLink: "https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes"
        }

        const response = await supertest(app).post("/recommendations").send(body);

        expect(response.status).toBe(201);
    });
});

describe("POST /recommendations/id/upvote", () => {
    beforeEach(truncateRecommendations);
    afterAll(disconnect);

    it("should return 200 and increment score", async () => {
        const name = await recommendationFactory.create();

        const recommendation = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });

        const response = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`).send({});

        const recommendationAfter = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });

        expect(response.status).toBe(200);
        expect(recommendationAfter.score).toBe(recommendation.score + 1);
    });
});

describe("POST /recommendations/id/downvote", () => {
    beforeEach(truncateRecommendations);
    afterAll(disconnect);

    it("should return 200 and increment score", async () => {
        const name = await recommendationFactory.create();

        const recommendation = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });

        const response = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`).send({});

        const recommendationAfter = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });

        expect(response.status).toBe(200);
        expect(recommendationAfter.score).toBe(recommendation.score - 1);
    });

    it("should return 200 and delete a recommendation if score goes to less then -5", async () => {
        const name = await recommendationFactory.create(-5);

        const recommendation = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });

        await supertest(app).post(`/recommendations/${recommendation.id}/downvote`).send({});


        const recommendationAfter = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });

        expect(recommendationAfter).toBe(null);
    });
});

async function truncateRecommendations() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
}

async function disconnect() {
    await prisma.$disconnect();
}