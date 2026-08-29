const { clientPromise } = require('../db/db')

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

  let  bins = bins_query_result.rows.length == 0 ? [] : bins_query_result.rows.map(
    ({ id, bin_name, request_count, created_at }) => ({
      id,
      bin_name,
      request_count,
      created_at
    })
  );

  return res.status(200).json(bins)
}

module.exports = { getBins }
