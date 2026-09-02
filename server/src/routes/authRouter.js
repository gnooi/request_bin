const express = require('express')
const authRouter = express.Router()

const { createNewUser } = require('../controllers/authController')

authRouter.post('/new', createNewUser)

module.exports = {
    authRouter,
}