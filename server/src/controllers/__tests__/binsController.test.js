jest.mock('../../models/bin', () => ({
    findBinsByUserId: jest.fn(),
    createBin: jest.fn()
}))
jest.mock('../../utils/validation', () => ({
    validateEndpoint: jest.fn()
}))

const { findBinsByUserId, createBin } = require('../../models/bin')
const { validateEndpoint } = require('../../utils/validation')
const { getBins, postBin } = require('../binsController')

describe('binsController', () => {
    let req, res

    beforeEach(() => {
        jest.clearAllMocks()
        req = { userId: 1, body: {} }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    })

    describe('getBins', () => {
        test('returns 200 with bins mapped to id, bin_name, request_count, created_at', async () => {
            findBinsByUserId.mockResolvedValue([
                {
                    id: 1,
                    bin_name: 'my_bin',
                    request_count: 5,
                    created_at: '2026-01-01',
                    user_id: 1
                }
            ])

            await getBins(req, res)

            expect(findBinsByUserId).toHaveBeenCalledWith(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith([
                {
                    id: 1,
                    bin_name: 'my_bin',
                    request_count: 5,
                    created_at: '2026-01-01'
                }
            ])
        })

        test('returns 200 with an empty array when the user has no bins', async () => {
            findBinsByUserId.mockResolvedValue([])

            await getBins(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith([])
        })
    })

    describe('postBin', () => {
        test('validates the endpoint, creates the bin, and returns 201', async () => {
            req.body.url_endpoint = 'new_endpoint'
            validateEndpoint.mockResolvedValue(true)
            createBin.mockResolvedValue({ id: 10, bin_name: 'new_endpoint' })

            await postBin(req, res)

            expect(validateEndpoint).toHaveBeenCalledWith('new_endpoint')
            expect(createBin).toHaveBeenCalledWith(1, 'new_endpoint')
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                id: 10,
                url_endpoint: 'new_endpoint'
            })
        })

        test('propagates validation errors and does not create a bin', async () => {
            req.body.url_endpoint = 'bad'
            const validationError = new Error('invalid endpoint')
            validateEndpoint.mockRejectedValue(validationError)

            await expect(postBin(req, res)).rejects.toThrow(validationError)
            expect(createBin).not.toHaveBeenCalled()
            expect(res.status).not.toHaveBeenCalled()
        })
    })
})
