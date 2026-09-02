import axios from 'axios'

const baseURL = 'http://localhost:3000/api/bins'

async function getAllBins() {
    const bins = await axios.get(baseURL)
    return bins.data
}

async function postBin(endpoint) {
    const addedBin = await axios.post(baseURL, {
        url_endpoint: endpoint
    })
    return addedBin.data
}

async function getAllRequests(endpoint) {
    const requests = await axios.get(`${baseURL}/${endpoint}/requests`)
    return requests.data
}

// get request by id
async function getRequestById(endpoint, requestId) {
    const request = await axios.get(`${baseURL}/${endpoint}/requests/${requestId}`)
    return request.data
}

export default {
    getAllBins,
    postBin,
    getAllRequests,
    getRequestById,
}
