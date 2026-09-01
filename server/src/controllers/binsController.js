const { findBinsByUserId, createBin } = require('../models/bin')
const { validateEndpoint } = require('../utils/validation')

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

async function postBin(req, res) {
  const userId = req.userId
  const endpoint = req.body.url_endpoint

  // checking if endpoint is valid/unique
  await validateEndpoint(endpoint)

  const addedBin = await createBin(userId, endpoint)

  // success response
  res.status(201).json({
    'id': addedBin.id,
    'url_endpoint': addedBin.bin_name,
  })
}

module.exports = {
  getBins,
  postBin,
}
