import axios from 'axios'

// hash this? for security
const TOKEN_KEY = 'auth_token'
const NEW_TOKEN_URL = 'http://localhost:3000/api/auth/new'

let tokenPromise = null

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
    localStorage.removeItem(TOKEN_KEY)
}

// need to create a `api/auth/new` endpoint
// that creates a new user with new token and returns a token
async function issueToken() {

    const res = await axios.post(NEW_TOKEN_URL)
    const { token } = res.data
    setStoredToken(token)
    return token
}

export function bootstrapToken() {
    const existing = getStoredToken()
    if (existing) {
        return existing
    }

    if (!tokenPromise) {
        tokenPromise = issueToken()
            .catch((err) => {
                console.warn('bootstrapToken: failed to issue auth token, continuing without one', err)
                return null
            })
            .finally(() => {
                // why does this happen?
                tokenPromise = null
            })
    }

    return tokenPromise
}

function addAuthHeaderToRequests(config) {
    const token = getStoredToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}

function passThroughResponse(response) {
    return response
}

async function retryWithFreshToken(error) {
    const original = error.config

    if (error.response?.status === 401 && !original._retried) {
        original._retried = true
        clearStoredToken()
        const token = await bootstrapToken()
        original.headers.Authorization = `Bearer ${token}`
        return axios(original)
    }

    return Promise.reject(error)
}

axios.interceptors.request.use(addAuthHeaderToRequests)

axios.interceptors.response.use(
    passThroughResponse,
    retryWithFreshToken,
)