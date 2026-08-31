const {
    NotFoundError,
    NotUniqueError,
    ValidationError,
    AuthorizationError
} = require('../errors')

describe('custom error classes', () => {
    test.each([
        ['NotFoundError', NotFoundError],
        ['NotUniqueError', NotUniqueError],
        ['ValidationError', ValidationError],
        ['AuthorizationError', AuthorizationError],
    ])('%s is an Error with the correct name and message', (expectedName, ErrorClass) => {
        const error = new ErrorClass('something went wrong')

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(ErrorClass)
        expect(error.name).toBe(expectedName)
        expect(error.message).toBe('something went wrong')
    })
})
