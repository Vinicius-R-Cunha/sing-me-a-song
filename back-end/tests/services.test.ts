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

        const recommendation = await prisma.recommendation.findUnique({
            where: {
                name: body.name
            }
        });

        expect(response.status).toBe(201);
        expect(recommendation.youtubeLink).toBe(body.youtubeLink);
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

describe("GET /recommendations", () => {
    beforeEach(truncateRecommendations);
    afterAll(disconnect);

    it("should return the last 10 recommendations from 15 avaiable and status 200", async () => {
        await recommendationFactory.createRandom(15);

        const response = await supertest(app).get(`/recommendations`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(10);
    });
});

describe("GET /recommendations/id", () => {
    beforeEach(truncateRecommendations);
    afterAll(disconnect);

    it("should return status 200 and the recommendation with that id", async () => {
        const name = await recommendationFactory.create();

        const recommendation = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });

        const response = await supertest(app).get(`/recommendations/${recommendation.id}`);

        expect(response.status).toBe(200);
    });
});

describe("GET /recommendations/random", () => {
    beforeEach(truncateRecommendations);
    afterAll(disconnect);

    it("should return status 200 and the one random recommendation", async () => {
        const name = await recommendationFactory.create();

        const recommendation = await prisma.recommendation.findUnique({
            where: {
                name
            }
        });

        const response = await supertest(app).get(`/recommendations/${recommendation.id}`);

        expect(response.status).toBe(200);
    });
});

describe("GET /recommendations/top/amount", () => {
    beforeEach(truncateRecommendations);
    afterAll(disconnect);

    it("should return status 200 and the top 12 recommendations", async () => {
        const amount = 12;

        await recommendationFactory.createRandom(5, 4);
        await recommendationFactory.createRandom(3, -2);
        await recommendationFactory.createRandom(4, 2);
        await recommendationFactory.createRandom(3, 3);

        const response = await supertest(app).get(`/recommendations/top/${amount}`);
        const responseWithAll = await supertest(app).get(`/recommendations/top/${amount + 3}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(amount);
        expect(responseWithAll.body[12]).toHaveProperty('score', -2);
        expect(responseWithAll.body[13]).toHaveProperty('score', -2);
        expect(responseWithAll.body[14]).toHaveProperty('score', -2);
    });
});

async function truncateRecommendations() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
}

async function disconnect() {
    await prisma.$disconnect();
}