import { jest } from '@jest/globals'
import { recommendationService } from '../../src/services/recommendationsService.js'
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js'
import * as recommendationFactory from '../factories/recommendationFactory.js'

describe('POST /recommendations', () => {
    it('should get to the end given a valid body', async () => {
        const body = recommendationFactory.createRandomBody()

        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValue(
            null
        )
        const insert = jest
            .spyOn(recommendationRepository, 'create')
            .mockResolvedValue(null)

        await recommendationService.insert(body)

        expect(insert).toHaveBeenCalledTimes(1)
    })

    it('should return conflict given a existent name', async () => {
        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValue({
            id: 1,
            name: 'Não - Tim Bernardes',
            youtubeLink:
                'https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes',
            score: 0,
        })

        expect(async () => {
            await recommendationService.insert({
                name: 'Não - Tim Bernardes',
                youtubeLink:
                    'https://www.youtube.com/watch?v=vEmPpZT6iJs&ab_channel=TimBernardes',
            })
        }).rejects.toEqual({
            message: 'Recommendations names must be unique',
            type: 'conflict',
        })
    })
})

describe('POST /recommendations/id/upvote', () => {
    it('should return not_found given a invalid id', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValue(null)

        expect(async () => {
            await recommendationService.upvote(1)
        }).rejects.toEqual({ message: '', type: 'not_found' })
    })

    it('should update score given a valid recommendation', async () => {
        const body = recommendationFactory.createRandomBody()

        jest.spyOn(recommendationRepository, 'find').mockResolvedValue({
            id: 1,
            ...body,
            score: 0,
        })

        const upvote = jest
            .spyOn(recommendationRepository, 'updateScore')
            .mockResolvedValue(null)

        await recommendationService.upvote(1)

        expect(upvote).toHaveBeenCalledTimes(1)
    })
})

describe('POST /recommendations/id/downvote', () => {
    it('should return not_found given a invalid id', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValue(null)

        expect(async () => {
            await recommendationService.downvote(1)
        }).rejects.toEqual({ message: '', type: 'not_found' })
    })

    it('should update score given a valid recommendation', async () => {
        const body = recommendationFactory.createRandomBody()

        jest.spyOn(recommendationRepository, 'find').mockResolvedValue({
            id: 1,
            ...body,
            score: 0,
        })

        const downvote = jest
            .spyOn(recommendationRepository, 'updateScore')
            .mockResolvedValue({
                id: 1,
                ...body,
                score: -1,
            })

        await recommendationService.downvote(1)

        expect(downvote).toHaveBeenCalled()
    })

    it('should delete recommendation given score less then -5', async () => {
        const body = recommendationFactory.createRandomBody()

        jest.spyOn(recommendationRepository, 'find').mockResolvedValue({
            id: 1,
            ...body,
            score: 0,
        })

        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValue({
            id: 1,
            ...body,
            score: -6,
        })

        const remove = jest
            .spyOn(recommendationRepository, 'remove')
            .mockResolvedValue(null)

        await recommendationService.downvote(1)

        expect(remove).toHaveBeenCalledTimes(1)
    })
})

describe('GET /recommendations', () => {
    it('should get to findAll function from repository', async () => {
        const allRecommendations = jest
            .spyOn(recommendationRepository, 'findAll')
            .mockResolvedValue([])

        await recommendationService.get()

        expect(allRecommendations).toHaveBeenCalledTimes(1)
    })
})

describe('GET /recommendations/top/amount', () => {
    it('should get to getAmountByScore function from repository', async () => {
        const topRecommendations = jest
            .spyOn(recommendationRepository, 'getAmountByScore')
            .mockResolvedValue([])

        await recommendationService.getTop(10)

        expect(topRecommendations).toHaveBeenCalledTimes(1)
    })
})

describe('POST /reset', () => {
    it('should get to getAmountByScore function from repository', async () => {
        const truncate = jest
            .spyOn(recommendationRepository, 'truncate')
            .mockResolvedValue(null)

        await recommendationService.truncate()

        expect(truncate).toHaveBeenCalledTimes(1)
    })
})

describe('GET /recommendations/random', () => {
    it('should return not_found given there are no recommendations', async () => {
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([])

        expect(async () => {
            await recommendationService.getRandom()
        }).rejects.toEqual({ message: '', type: 'not_found' })
    })

    it('should return a recommendation given scoreFilter lte', async () => {
        const body = recommendationFactory.createRandomBody()

        jest.spyOn(recommendationService, 'getScoreFilter').mockReturnValue(
            'lte'
        )
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([
            {
                id: 1,
                ...body,
                score: 0,
            },
        ])

        const recommendation = await recommendationService.getRandom()

        expect(recommendation).toBeTruthy()
    })

    it('should return a recommendation given scoreFilter gt', async () => {
        const body = recommendationFactory.createRandomBody()

        jest.spyOn(recommendationService, 'getScoreFilter').mockReturnValue(
            'gt'
        )
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([
            {
                id: 1,
                ...body,
                score: 0,
            },
        ])

        const recommendation = await recommendationService.getRandom()

        expect(recommendation).toBeTruthy()
    })
})
