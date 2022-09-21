import { faker } from '@faker-js/faker'
import { Recommendation } from '@prisma/client'
import { prisma } from '../../src/database'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'
import { CreateRecommendationData } from '../../src/services/recommendationsService'

const manyRecommendations = [
    {
        name: "On Top of The World",
        youtubeLink: "https://www.youtube.com/watch?v=w5tWYmIOWGk",
        score: 120
    },
    {
        name: "It's Time",
        youtubeLink: "https://www.youtube.com/watch?v=sENM2wA_FTg",
        score: 50
    },
    {
        name: "Demons",
        youtubeLink: "https://www.youtube.com/watch?v=mWRsgZuwf_8",
        score: -30
    }
]

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
    await prisma.recommendation.createMany({
        data: manyRecommendations
    })

    const recommendations: Recommendation[] = await recommendationRepository.findAll()

    return recommendations
}

export async function resetRecommendations() {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`
}

export async function recommendationTop(qtd: number): Promise<Recommendation[]> {
    await prisma.recommendation.createMany({
        data: manyRecommendations
    })

    const recommendations: Recommendation[] = await recommendationRepository.getAmountByScore(qtd)

    return recommendations
}

export async function recommendationDeleteDownvote(): Promise<number> {
    const recommendation: Recommendation = await insertRecommendation()

    await prisma.recommendation.update({ where: { id: recommendation.id }, data: { score: -6 } })

    return recommendation.id
}

export async function findRecommendation(name: string): Promise<Recommendation | null> {
    const recommendation: Recommendation | null = await prisma.recommendation.findUnique({
        where: {
            name
        }
    })

    return recommendation
}