import supertest from "supertest"
import app from "../src/app"
import { prisma } from "../src/database"
import * as recommendationFactory from './factories/recommendationFactory'

beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`
})

describe('POST /recommendations', () => {
    it('given a correct recommendation body, return 200', async () => {
        const recommendation = recommendationFactory.createRecommendation()

        const result = await supertest(app).post('/recommendations').send(recommendation)

        expect(result.status).toBe(201)
    })

    it('given a malformed link, return 422', async () => {
        const recommendation = recommendationFactory.wrongRecommendationLink()

        const result = await supertest(app).post('/recommendations').send(recommendation)

        expect(result.status).toBe(422)
    })

    it('given a name already inserted, return 409', async () => {
        const recommendation = await recommendationFactory.insertRecommendation()

        const result = await supertest(app).post('/recommendations').send({
            name: recommendation.name,
            youtubeLink: recommendation.youtubeLink
        })

        expect(result.status).toBe(409)
    })
})

describe('POST /recommendations/:id/upvote', () => {
    it('given a found id, return 200', async () => {
        const recommendation = await recommendationFactory.insertRecommendation()

        const result = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`)

        expect(result.status).toBe(200)
    })

    it('given a not found id, return 404', async () => {
        const result = await supertest(app).post(`/recommendations/-1/upvote`)

        expect(result.status).toBe(404)
    })
})

describe('POST /recommendations/:id/downvote', () => {
    it('given a found id, return 200', async () => {
        const recommendation = await recommendationFactory.insertRecommendation()

        const result = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`)

        expect(result.status).toBe(200)
    })

    it('given a not found id, return 404', async () => {
        const result = await supertest(app).post(`/recommendations/-1/downvote`)

        expect(result.status).toBe(404)
    })
})

describe('GET /recommendations', () => {
    it('given an array of recommendations, return 200', async () => {
        const recommendations = await recommendationFactory.recommendationsLimit10()

        const result = await supertest(app).get('/recommendations')

        expect(result.status).toBe(200)
        expect(result.body).toBeInstanceOf(Array)
        expect(result.body).toEqual(expect.objectContaining(recommendations))
        expect(result.body.length).toBeLessThanOrEqual(10)
    })
})

describe('GET /recommendations', () => {
    it('given a correct recommendation object on get, return 200', async () => {
        const recommendation = await recommendationFactory.insertRecommendation()

        const result = await supertest(app).get(`/recommendations/${recommendation.id}`)

        expect(result.status).toBe(200)
        expect(result.body).toEqual(expect.objectContaining(recommendation))
    })

    it('given a not found id, return 404', async () => {
        const result = await supertest(app).get(`/recommendations/-1`)

        expect(result.status).toBe(404)
    })
})

describe('GET /recommendations/random', () => {
    it('given a correct random recommendation object, return 200', async () => {
        const result = await supertest(app).get(`/recommendations/random`)

        expect(result.status).toBe(200)
        expect(result.body).toBeInstanceOf(Object)
    })

    it('given a get and not found any recommendation on db, return 404', async () => {
        await recommendationFactory.resetRecommendations()

        const result = await supertest(app).get(`/recommendations/random`)

        expect(result.status).toBe(404)
    })
})

afterAll(async () => {
    await prisma.$disconnect()
})