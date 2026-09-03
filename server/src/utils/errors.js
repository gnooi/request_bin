class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = "NotFoundError"
    }
}

class NotUniqueError extends Error {
    constructor(message) {
        super(message)
        this.name = "NotUniqueError"
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}

class AuthorizationError extends Error {
    constructor(message) {
        super(message)
        this.name = "AuthorizationError"
    }
}

module.exports = {
    NotFoundError,
    ValidationError,
    AuthorizationError,
    NotUniqueError
}