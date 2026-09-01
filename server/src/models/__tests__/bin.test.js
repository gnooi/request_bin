const mockClient = { query: jest.fn() }

jest.mock('../../db/postgres', () => ({
    clientPromise: Promise.resolve(mockClient)
}))

const { findBinsByUserId, findBinByName, createBin } = require('../bin')

describe('bin model', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('findBinsByUserId', () => {
        test('queries bins for the given user id and returns rows', async () => {
            const rows = [{ id: 1, bin_name: 'my_bin', user_id: 42 }]
            mockClient.query.mockResolvedValue({ rows })

            const result = await findBinsByUserId(42)

            expect(mockClient.query).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: 'SELECT * FROM bins WHERE user_id = $1',
                    values: [42]
                })
            )
            expect(result).toEqual(rows)
        })
    })

    describe('findBinByName', () => {
        test('queries bins for the given bin name and returns rows', async () => {
            const rows = [{ id: 2, bin_name: 'existing_name' }]
            mockClient.query.mockResolvedValue({ rows })

            const result = await findBinByName('existing_name')

            expect(mockClient.query).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: 'SELECT * FROM bins WHERE bin_name = $1',
                    values: ['existing_name']
                })
            )
            expect(result).toEqual(rows)
        })

        test('returns an empty array when no bin matches', async () => {
            mockClient.query.mockResolvedValue({ rows: [] })

            const result = await findBinByName('missing_name')

            expect(result).toEqual([])
        })
    })

    describe('createBin', () => {
        test('inserts a bin for the user and returns the created row', async () => {
            const createdRow = { id: 3, user_id: 42, bin_name: 'new_bin' }
            mockClient.query.mockResolvedValue({ rows: [createdRow] })

            const result = await createBin(42, 'new_bin')

            expect(mockClient.query).toHaveBeenCalledWith(
                expect.objectContaining({
                    text: 'INSERT INTO bins (user_id, bin_name) VALUES ($1, $2) RETURNING *',
                    values: [42, 'new_bin']
                })
            )
            expect(result).toEqual(createdRow)
        })
    })
})
