const crypto = require('crypto')
const { getPool } = require('../db/postgres')

/**
 * Generates a random 32-byte hex token,
 * creates new user associated with the token
 * @returns the generated token
 */
async function insertUserWithToken() {
    const pool = getPool()

    for (let attempts = 0; attempts < 5; attempts += 1) {
        const token = crypto.randomBytes(32).toString('hex');
        try {
            await pool.query(
                `INSERT INTO users (token) VALUES ($1)`,
                [token]
            );
            return token;
        } catch (err) {
            // violated unique constraint
            if (err.code === '23505') continue;
            throw err;
        }
    }

    throw new Error('Failed to generate unique token')
}

/**
 * For first time visiting users -
 * creates new user, 
 * responds with status code 201 and 
 * newly generated token to be stored on browser's localStorage
 */
async function createNewUser(req, res) {
    const token = await insertUserWithToken()
    res.status(201).json({token})
}

module.exports = {
    createNewUser,
}