// generate a new token
// create a new user and store that token into the database
// response with the { token }

const crypto = require('crypto')
const { getPool } = require('../db/postgres')

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

async function createNewUser(req, res) {
    const token = await insertUserWithToken()
    res.status(201).json({token})
}

module.exports = {
    createNewUser,
}