import { faker } from '@faker-js/faker'
import { Recommendation } from '@prisma/client'
import { prisma } from '../../src/database'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'
import { CreateRecommendationData } from '../../src/services/recommendationsService'

export function __manyRecommendations() {
    let recommendations: any = []
    let hashNames: any = {}

    for (let i = 0; i < 10; i++) {
        const recommendation = {
            id: i + 1,
            name: faker.lorem.words(2),
            youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(10)}`,
            score: faker.datatype.number(3)
        }

        if (i === 0) {
            hashNames[recommendation.name] = true
            recommendations.push(recommendation)
        } else {
            if (!recommendations[recommendation.name]) {
                recommendations.push(recommendation)
            }
        }
    }

    return recommendations
}

export function __recommendationsOrderedByScore() {
    return __manyRecommendations().sort((a: any, b: any) => b.score - a.score)
}

export function __baseRecommendation() {
    return {
        id: 1,
        name: faker.lorem.words(2),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(10)}`,
        score: 0
    }
}

export function __createRecommendation(): CreateRecommendationData {
    return {
        name: faker.lorem.words(2),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(10)}`
    }
}

export async function __insertRecommendation(): Promise<Recommendation> {
    const recommendation: CreateRecommendationData = __createRecommendation()

    const insertedRecommendation = await prisma.recommendation.create({
        data: recommendation
    })

    return insertedRecommendation
}

export function __wrongRecommendationLink(): CreateRecommendationData {
    const recommendation = {
        name: faker.lorem.words(2),
        youtubeLink: `not a link`
    }

    return recommendation
}

export async function __recommendationsLimit10(): Promise<Recommendation[]> {
    await prisma.recommendation.createMany({
        data: __manyRecommendations()
    })

    const recommendations: Recommendation[] = await recommendationRepository.findAll()

    return recommendations
}

export async function __recommendationTop(qtd: number): Promise<Recommendation[]> {
    await prisma.recommendation.createMany({
        data: __manyRecommendations()
    })

    const recommendations: Recommendation[] = await recommendationRepository.getAmountByScore(qtd)

    return recommendations
}

export async function __recommendationDeleteDownvote(): Promise<Recommendation> {
    const recommendation: Recommendation = await __insertRecommendation()

    const recommendationToDelete = await prisma.recommendation.update({ where: { id: recommendation.id }, data: { score: -6 } })

    return recommendationToDelete
}

export async function __findRecommendation(name: string): Promise<Recommendation | null> {
    const recommendation: Recommendation | null = await prisma.recommendation.findUnique({
        where: {
            name
        }
    })

    return recommendation
}