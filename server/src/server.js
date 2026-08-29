const express = require('express')
const app = express()

const { getBins } = require('./controllers/bins_controller.js')
const { authenticate } = require('./middleware/authenticate.js')

const PORT = 3000
app.listen(PORT, () => {
    console.log(`We are runninggggg!!!!! app running on port: ${PORT}`)
})


app.get('/' , () => {
  console.log('I am getting to home')

})

app.get('/api/bins', authenticate, getBins)


app.post('/api/bins' , authenticate, (req, res) => {
  console.log('I am geting the POST request')
})








