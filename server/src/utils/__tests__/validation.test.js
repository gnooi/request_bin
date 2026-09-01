jest.mock('../../models/bin', () => ({
    findBinByName: jest.fn()
}))

const { findBinByName } = require('../../models/bin')
const { validateEndpoint } = require('../validation')
const { ValidationError, NotUniqueError } = require('../errors')

describe('validateEndpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('throws ValidationError when endpoint is missing', async () => {
        await expect(validateEndpoint(undefined)).rejects.toThrow(ValidationError)
        await expect(validateEndpoint('')).rejects.toThrow(ValidationError)
    })

    test('throws ValidationError when endpoint is shorter than 3 characters', async () => {
        await expect(validateEndpoint('ab')).rejects.toThrow(ValidationError)
    })

    test('throws ValidationError when endpoint is longer than 20 characters', async () => {
        await expect(validateEndpoint('a'.repeat(21))).rejects.toThrow(ValidationError)
    })

    test('throws ValidationError when endpoint has invalid characters', async () => {
        await expect(validateEndpoint('bad-endpoint!')).rejects.toThrow(ValidationError)
    })

    test('throws NotUniqueError when endpoint is already taken', async () => {
        findBinByName.mockResolvedValue([{ id: 1, bin_name: 'taken_name' }])

        await expect(validateEndpoint('taken_name')).rejects.toThrow(NotUniqueError)
        expect(findBinByName).toHaveBeenCalledWith('taken_name')
    })

    test('resolves true for a valid, unique endpoint', async () => {
        findBinByName.mockResolvedValue([])

        await expect(validateEndpoint('valid_name')).resolves.toBe(true)
        expect(findBinByName).toHaveBeenCalledWith('valid_name')
    })
})
