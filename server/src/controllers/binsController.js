const { findBinsByUserId, createBin } = require('../models/bin')
const { validateEndpoint } = require('../utils/validation')

/**
 * Gets all bins for user,
 * responds 200 with bins
 */
async function getBins(req, res) {
  const userId = req.userId

  const rows = await findBinsByUserId(userId)

  const bins = rows.map(
    ({ id, bin_name, request_count, created_at }) => ({
      id,
      bin_name,
      request_count,
      created_at
    })
  )

  return res.status(200).json(bins)
}

/**
 * Creates a new bin for a user,
 * responds 201 with created id, url_endpoint
 */
async function postBin(req, res) {
  const userId = req.userId
  const endpoint = req.body.url_endpoint

  // checking if endpoint is valid/unique
  await validateEndpoint(endpoint)

  const addedBin = await createBin(userId, endpoint)

  res.status(201).json({
    'id': addedBin.id,
    'url_endpoint': addedBin.bin_name,
  })
}

module.exports = {
  getBins,
  postBin,
}
