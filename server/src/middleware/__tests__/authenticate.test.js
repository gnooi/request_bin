const mockClient = { query: jest.fn() }

jest.mock('../../db/postgres', () => ({
    clientPromise: Promise.resolve(mockClient)
}))

const { authenticate } = require('../authenticate')
const { AuthorizationError } = require('../../utils/errors')

describe('authenticate middleware', () => {
    let req, res, next

    beforeEach(() => {
        jest.clearAllMocks()
        req = { headers: {} }
        res = {}
        next = jest.fn()
    })

    test('throws AuthorizationError when the authorization header is missing', async () => {
        await expect(authenticate(req, res, next)).rejects.toThrow(AuthorizationError)
        expect(next).not.toHaveBeenCalled()
        expect(mockClient.query).not.toHaveBeenCalled()
    })

    test('throws AuthorizationError when the token type is not Bearer', async () => {
        req.headers.authorization = 'Basic sometoken'

        await expect(authenticate(req, res, next)).rejects.toThrow(AuthorizationError)
        expect(next).not.toHaveBeenCalled()
    })

    test('throws AuthorizationError when no user matches the token', async () => {
        req.headers.authorization = 'Bearer badtoken'
        mockClient.query.mockResolvedValue({ rows: [] })

        await expect(authenticate(req, res, next)).rejects.toThrow(AuthorizationError)
        expect(mockClient.query).toHaveBeenCalledWith(
            expect.objectContaining({ values: ['badtoken'] })
        )
        expect(next).not.toHaveBeenCalled()
    })

    test('sets req.userId and calls next when the token is valid', async () => {
        req.headers.authorization = 'Bearer goodtoken'
        mockClient.query.mockResolvedValue({ rows: [{ id: 7 }] })

        await authenticate(req, res, next)

        expect(req.userId).toBe(7)
        expect(next).toHaveBeenCalledTimes(1)
    })
})
