const { errorHandler } = require('../errorHandler')
const {
    ValidationError,
    NotUniqueError,
    AuthorizationError,
    NotFoundError
} = require('../../utils/errors')

describe('errorHandler middleware', () => {
    let req, res, next, logSpy

    beforeEach(() => {
        req = {}
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
        next = jest.fn()
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        logSpy.mockRestore()
    })

    test('responds 400 for ValidationError', () => {
        const error = new ValidationError('bad input')

        errorHandler(error, req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: 'bad input' })
        expect(next).not.toHaveBeenCalled()
    })

    test('responds 409 for NotUniqueError', () => {
        const error = new NotUniqueError('already taken')

        errorHandler(error, req, res, next)

        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({ error: 'already taken' })
        expect(next).not.toHaveBeenCalled()
    })

    test('responds 401 for AuthorizationError', () => {
        const error = new AuthorizationError('not allowed')

        errorHandler(error, req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ error: 'not allowed' })
        expect(next).not.toHaveBeenCalled()
    })

    test('forwards unrecognized errors to next', () => {
        const error = new NotFoundError('not found')

        errorHandler(error, req, res, next)

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(error)
    })
})
