const { clientPromise } = require('../db/db')
const { validateEndpoint } = require('../utils/validation')

async function getBins(req, res) {
  
  const user_id = req.user_id

  const client = await clientPromise

  // pull the id

  const bins_query = {
    name: `fetch bins for user`,
    text: `SELECT  * FROM bins WHERE user_id = $1`,
    values: [user_id]
  };

  const bins_query_result = await client.query(bins_query);

  let bins = bins_query_result.rows.length == 0 ? [] : bins_query_result.rows.map(
    ({ id, bin_name, request_count, created_at }) => ({
      id,
      bin_name,
      request_count,
      created_at
    })
  );

  return res.status(200).json(bins)
}

async function postBin(req, res) {
  const user_id = req.user_id
  const client = await clientPromise
  const endpoint = req.body.url_endpoint

  // checking if endpoint is valid/unique
  await validateEndpoint(endpoint)

  // adding endpoint
  const add_bin_query = {
    name: 'adding bin to user',
    text: 'INSERT INTO bins (user_id, bin_name) VALUES ($1, $2) RETURNING *',
    values: [user_id, endpoint]
  }

  const result = await client.query(add_bin_query)
  const added_bin = result.rows[0]

  // success response
  res.status(201).json({
    'id': added_bin.id,
    'url_endpoint': added_bin.bin_name,
  })
}

module.exports = {
  getBins,
  postBin,
}
