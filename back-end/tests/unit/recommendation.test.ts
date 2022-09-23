import { recommendationService } from '../../src/services/recommendationsService'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'
import * as recommendationFactory from '../factories/recommendationFactory'
import { conflictError, notFoundError } from '../../src/utils/errorUtils'

beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
})

describe('POST /recommendations', () => {
    it('expect to name to be not found and create recommendation', async () => {
        const recommendation = recommendationFactory.__baseRecommendation()

        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(null)
        jest.spyOn(recommendationRepository, 'create').mockResolvedValueOnce()

        await expect(recommendationService.insert(recommendation)).resolves.not.toThrow()

        expect(recommendationRepository.findByName).toHaveBeenCalledWith(recommendation.name)
        expect(recommendationRepository.create).toHaveBeenCalled()
    })

    it('expect to name to be found and dont create recommendation', async () => {
        const recommendation = recommendationFactory.__baseRecommendation()

        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(recommendation)

        await expect(recommendationService.insert({
            name: recommendation.name,
            youtubeLink: recommendation.youtubeLink
        })).rejects.toEqual(conflictError('Recommendations names must be unique'))

        expect(recommendationRepository.findByName).toHaveBeenCalledWith(recommendation.name)
    })
})

describe('POST /recommendations/:id/upvote', () => {
    it('expect to increase one to recommendation score', async () => {
        const recommendation = recommendationFactory.__baseRecommendation()
        const EXPECTED_SCORE = 1

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation)
        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce(recommendation)

        await expect(recommendationService.upvote(recommendation.id)).resolves.not.toThrow()

        expect(recommendationRepository.find).toHaveBeenCalledWith(recommendation.id)
        expect(recommendationRepository.updateScore).toHaveBeenCalledWith(recommendation.id, 'increment')
        expect(recommendation.score).toBeLessThan(EXPECTED_SCORE)
    })

    it('expect to not found recommendation id', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null)

        await expect(recommendationService.upvote(-1)).rejects.toEqual(notFoundError())

        expect(recommendationRepository.find).toHaveBeenCalledWith(-1)
        expect(recommendationRepository.updateScore).not.toHaveBeenCalled()
    })
})

describe('POST /recommendations/:id/downvote', () => {
    it('expect to increase one to recommendation score', async () => {
        const recommendation = recommendationFactory.__baseRecommendation()
        const EXPECTED_SCORE = -1

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation)
        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce(recommendation)

        await expect(recommendationService.downvote(recommendation.id)).resolves.not.toThrow()

        expect(recommendationRepository.find).toHaveBeenCalledWith(recommendation.id)
        expect(recommendationRepository.updateScore).toHaveBeenCalledWith(recommendation.id, 'decrement')
        expect(recommendation.score).toBeGreaterThan(EXPECTED_SCORE)
    })

    it('expect to not found recommendation id', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null)

        await expect(recommendationService.downvote(-1)).rejects.toEqual(notFoundError())

        expect(recommendationRepository.find).toHaveBeenCalledWith(-1)
        expect(recommendationRepository.updateScore).not.toHaveBeenCalled()
    })

    it('expect to delete a recommendation with score less than -5', async () => {
        const recommendation = recommendationFactory.__baseRecommendation()
        const EXPECTED_SCORE = -5
        recommendation.score = -6

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation)
        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce(recommendation)
        jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce()

        await expect(recommendationService.downvote(recommendation.id)).resolves.not.toThrow()

        expect(recommendationRepository.find).toHaveBeenCalledWith(recommendation.id)
        expect(recommendationRepository.updateScore).toHaveBeenCalledWith(recommendation.id, 'decrement')
        expect(recommendation.score).toBeLessThan(EXPECTED_SCORE)
        expect(recommendationRepository.remove).toHaveBeenCalledWith(recommendation.id)
    })
})

describe('GET /recommendations', () => {
    it('given an array of recommendations, return 200', async () => {
        const recommendations = recommendationFactory.__manyRecommendations()

        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce(recommendations)

        const allRecommendations = await recommendationService.get()

        expect(allRecommendations.length).toEqual(10)
        expect(allRecommendations).toBeInstanceOf(Array)
        expect(allRecommendations).toEqual(recommendations)
    })
})

describe('GET /recommendations/:id', () => {
    it('given a correct recommendation object on get, return 200', async () => {

    })

    it('given a not found id, return 404', async () => {

    })
})

describe('GET /recommendations/random', () => {
    it('given a correct random recommendation object, return 200', async () => {

    })

    it('given a get and not found any recommendation on db, return 404', async () => {

    })
})

describe('GET /recommendations/top/:amount', () => {
    it('given a array of objects ordered by score passing amount, return 200', async () => {

    })
})