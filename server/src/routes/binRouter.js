const express = require('express')
const binRouter = express.Router()

const {
    getBins,
    postBin,
} = require('../controllers/bins_controller')

binRouter.get('/', getBins)
binRouter.post('/', postBin)

module.exports = { binRouter }