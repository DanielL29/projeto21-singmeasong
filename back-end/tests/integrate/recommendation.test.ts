import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import * as recommendationFactory from "../factories/recommendationFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
});

describe("POST /recommendations", () => {
  it("given a correct recommendation body, return 200", async () => {
    const recommendation = recommendationFactory.__createRecommendation();

    const result = await supertest(app).post("/recommendations").send(recommendation);
    const after = await recommendationFactory.__findRecommendation(recommendation.name);

    expect(result.status).toBe(201);
    expect(after).not.toBeNull();
  });

  it("given a malformed link, return 422", async () => {
    const recommendation = recommendationFactory.__wrongRecommendationLink();

    const result = await supertest(app).post("/recommendations").send(recommendation);

    expect(result.status).toBe(422);
  });

  it("given a name already inserted, return 409", async () => {
    const recommendation = await recommendationFactory.__insertRecommendation();

    const result = await supertest(app).post("/recommendations").send({
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    });

    expect(result.status).toBe(409);
  });
});

describe("POST /recommendations/:id/upvote", () => {
  it("given a found id, return 200", async () => {
    const recommendation = await recommendationFactory.__insertRecommendation();

    const result = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`);
    const after = await recommendationFactory.__findRecommendation(recommendation.name);

    expect(result.status).toBe(200);
    expect(after!.score).toBeGreaterThan(recommendation.score);
  });

  it("given a not found id, return 404", async () => {
    const result = await supertest(app).post(`/recommendations/-1/upvote`);

    expect(result.status).toBe(404);
  });
});

describe("POST /recommendations/:id/downvote", () => {
  it("given a found id, return 200", async () => {
    const recommendation = await recommendationFactory.__insertRecommendation();

    const result = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
    const after = await recommendationFactory.__findRecommendation(recommendation.name);

    expect(result.status).toBe(200);
    expect(after!.score).toBeLessThan(recommendation.score);
  });

  it("given a not found id, return 404", async () => {
    const result = await supertest(app).post(`/recommendations/-1/downvote`);

    expect(result.status).toBe(404);
  });

  it("given a downvote less than -5 delete a recommendation, return 404", async () => {
    const recommendation = await recommendationFactory.__recommendationDeleteDownvote();

    await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
    const result = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);

    expect(result.status).toBe(404);
  });
});

describe("GET /recommendations", () => {
  it("given an array of recommendations, return 200", async () => {
    const recommendations = await recommendationFactory.__recommendationsLimit10();

    const result = await supertest(app).get("/recommendations");

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
    expect(result.body).toEqual(expect.objectContaining(recommendations));
    expect(result.body.length).toBeLessThanOrEqual(10);
  });
});

describe("GET /recommendations/:id", () => {
  it("given a correct recommendation object on get, return 200", async () => {
    const recommendation = await recommendationFactory.__insertRecommendation();

    const result = await supertest(app).get(`/recommendations/${recommendation.id}`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual(expect.objectContaining(recommendation));
  });

  it("given a not found id, return 404", async () => {
    const result = await supertest(app).get(`/recommendations/-1`);

    expect(result.status).toBe(404);
  });
});

describe("GET /recommendations/random", () => {
  it("given a correct random recommendation object, return 200", async () => {
    await recommendationFactory.__recommendationsLimit10();

    const result = await supertest(app).get(`/recommendations/random`);

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it("given a get and not found any recommendation on db, return 404", async () => {
    const result = await supertest(app).get(`/recommendations/random`);

    expect(result.status).toBe(404);
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("given a array of objects ordered by score passing amount, return 200", async () => {
    const recommendations = await recommendationFactory.__recommendationTop(10);

    const result = await supertest(app).get(`/recommendations/top/${10}`);

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
    expect(result.body).toEqual(expect.objectContaining(recommendations));
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
