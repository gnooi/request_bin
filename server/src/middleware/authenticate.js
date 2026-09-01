const { getPool } = require('../db/postgres');
const { AuthorizationError } = require('../utils/errors');

async function authenticate(req, res, next) {
  // get the authorization token from request

  if (req.headers.authorization === undefined) {
    throw new AuthorizationError(
      "Sorry can't get bins without an authorization token being missing",
    );
  }

  const [type, token] = req.headers.authorization.split(' ');

  if (type !== 'Bearer') {
    throw new AuthorizationError('Sorry the token type is wrong.');
  }

  const pool = await getPool();
  const idQuery = {
    name: 'fetch_user_id',
    text: `SELECT users.id FROM users WHERE users.token = $1`,
    values: [token],
  };

  const idQueryResult = await pool.query(idQuery);
  const userId = idQueryResult.rows.length == 0 ? -1 : idQueryResult.rows[0].id;

  if (userId === -1) {
    throw new AuthorizationError("Sorry we don't have any bins for that token");
  }

  // assigning the userId to the request object and passing it to the next handler which is binsController.js
  req.userId = userId;
  next();
}

module.exports = { authenticate };
