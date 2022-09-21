import { faker } from '@faker-js/faker'
import { Recommendation } from '@prisma/client'
import { prisma } from '../../src/database'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'
import { CreateRecommendationData } from '../../src/services/recommendationsService'

export function createRecommendation(): CreateRecommendationData {
    const recommendation = {
        name: faker.lorem.words(2),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(10)}`
    }

    return recommendation
}

export async function insertRecommendation(): Promise<Recommendation> {
    const recommendation: CreateRecommendationData = createRecommendation()

    const insertedRecommendation = await prisma.recommendation.create({
        data: recommendation
    })

    return insertedRecommendation
}

export function wrongRecommendationLink(): CreateRecommendationData {
    const recommendation = {
        name: faker.lorem.words(2),
        youtubeLink: `not a link`
    }

    return recommendation
}

export async function recommendationsLimit10(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = await recommendationRepository.findAll()

    return recommendations
}

export async function resetRecommendations() {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`
}

export async function recommendationTop(qtd: number): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = await recommendationRepository.getAmountByScore(qtd)

    return recommendations
}

export async function recommendationDeleteDownvote(): Promise<number> {
    const recommendation = await insertRecommendation()

    await prisma.recommendation.update({ where: { id: recommendation.id }, data: { score: -6 } })

    return recommendation.id
}