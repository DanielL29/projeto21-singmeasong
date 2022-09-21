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