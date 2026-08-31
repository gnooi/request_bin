const {
    ValidationError,
    NotUniqueError,
    AuthorizationError
} = require('../utils/errors')

function errorHandler(error, req, res, next) {
    console.log(error.message)

    if (error instanceof ValidationError) {
        return res.status(400).json({error: error.message})
    } else if (error instanceof NotUniqueError) {
        return res.status(409).json({error: error.message})
    } else if (error instanceof AuthorizationError) {
        return res.status(401).json({error: error.message})
    }

    next(error)
}

module.exports = {
    errorHandler
}