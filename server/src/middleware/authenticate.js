const { clientPromise } = require('../db/db')

async function authenticate(req, res, next) {

  // get the authorization token from request
  //

  if (req.headers.authorization === undefined) return res.status(401).send(`Sorry can't get bins without an authorization token being missing`)

  const [type, token]  = req.headers.authorization.split(' ');


  if (type !== 'Bearer') return res.status(401).send('Sorry the token type is wrong.')

  const client = await clientPromise
  const id_query = {
    name: 'fetch_user_id',
    text: `SELECT users.id FROM users WHERE users.token = $1`,
    values: [token]
  }

  const id_query_result = await client.query(id_query)
  const user_id =  id_query_result.rows.length == 0 ? -1 : id_query_result.rows[0].id;

  if (user_id === -1) return res.status(401).send(`Sorry we don't have any bins for that token`);

  // assigning the user_id to the request object and passing it to the next handler which is bins_controller.js
  req.user_id = user_id
  next()
}

module.exports = { authenticate }
