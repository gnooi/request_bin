const express = require('express')
const app = express()

const { binRouter } = require('./routes/binRouter.js')
const { authenticate } = require('./middleware/authenticate.js')
const { errorHandler } = require('./middleware/error_handler.js')

app.use(express.json())

app.get('/' , () => {
  console.log('I am getting to home')
})

app.use('/api/bins', authenticate, binRouter)

app.use(errorHandler)

module.exports = { app }






