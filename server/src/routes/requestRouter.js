const express = require('express')
const requestRouter = express.Router()

const {
    getBins,
    postBin,
} = require('../controllers/binsController')

requestRouter.get('/', getBins)
requestRouter.post('/', postBin)

module.exports = { requestRouter }