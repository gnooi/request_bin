const express = require('express')
const app = express()

const { requestRouter } = require('./routes/requestRouter.js')
const { authenticate } = require('./middleware/authenticate.js')
const { errorHandler } = require('./middleware/errorHandler.js')

app.use(express.json())

app.get('/' , () => {
  console.log('I am getting to home')
})

app.use('/api/bins', authenticate, requestRouter)

app.use(errorHandler)

module.exports = { app }






