const { clientPromise } = require('../db/db')

const {
    ValidationError,
    NotUniqueError
} = require('./errors')

const MIN_LENGTH = 3
const MAX_LENGTH = 20

async function validateEndpoint(endpoint) {
    if (!endpoint) {
        throw new ValidationError('Missing endpoint')
    } else if (endpoint.length < MIN_LENGTH || endpoint.length > MAX_LENGTH) {
        throw new ValidationError('Endpoint must be between 3 and 20 characters')
    } else if (!hasValidChars(endpoint)) {
        throw new ValidationError('Endpoint must be made up of letters, numbers, and underscores')
    } else if (!await isUnique(endpoint)) {
        throw new NotUniqueError('Endpoint is taken, please choose another')
    }
    
    return true
}

function hasValidChars(str) {
    return /^[a-zA-Z0-9_]+$/.test(str)
}

async function isUnique(endpoint) {
    const client = await clientPromise
    const bin_exists_query = {
        name: 'check if endpoint exists in bins',
        text: 'SELECT * FROM bins WHERE bin_name = $1',
        values: [endpoint]
    }

    const bin_exists = await client.query(bin_exists_query)

    if (bin_exists.rowCount !== 0) {
        return false
    }
    return true
}

module.exports = {
    validateEndpoint
}