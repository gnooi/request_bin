const { Client } = require('pg')

const clientPromise = new Promise((resolve, reject) => {
  resolve(new Client({
    connectionString: `${process.env.DATABASE_URL}`}
  ).connect())
})

module.exports = { clientPromise }
