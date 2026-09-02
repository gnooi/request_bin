const { getPool } = require('../db/postgres')
const Request = require('../../models/RequestPayload')

const BATCH_SIZE = 1000
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

async function purgeRequestsOlderThan(cutoffDate) {
    const pool = getPool()
    let totalDeleted = 0
    const deleteQuery = `
        DELETE FROM requests
        WHERE id IN (
            SELECT id FROM requests
            WHERE received_at < $1
            ORDER BY id
            LIMIT $2
        )
        RETURNING id, bin_id
    `
    while (true) {

        // delete requests older than date, captures id
        const { rows } = await pool.query(
            deleteQuery,
            [cutoffDate, BATCH_SIZE]
        )

        // if there are no requests older than 1 mo
        if (rows.length === 0) break;

        // deletes those mongoDB requests
        const ids = rows.map((r) => r.id);
        await Request.deleteMany({ _id: { $in: ids }})

        // update counts for bins that had requests deleted
        const updateCountsQuery = `
            UPDATE bins SET request_count = request_count - $1 WHERE id = $2
        `

        const countsByBin = rows.reduce((acc, r) => {
            acc[r.bin_id] = (acc[r.bin_id] || 0) + 1
            return acc
        }, {})

        for (const [binId, count] of Object.entries(countsByBin)) {
            await pool.query(
                updateCountsQuery,
                [count, binId],
            )
        }

        totalDeleted += rows.length
    
        if (rows.length < BATCH_SIZE) break
    }

    return totalDeleted;
}

async function purgeOldRequests() {
    // one month ago
    const cutoff = new Date(Date.now() - MAX_AGE_MS)
    const deleted = await purgeRequestsOlderThan(cutoff)
    console.log(`Purged ${deleted} request(s) older than ${cutoff.toISOString()}`)
    return deleted
}

module.exports = { 
    purgeOldRequests,
    purgeRequestsOlderThan,
}