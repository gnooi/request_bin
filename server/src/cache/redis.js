const { createCluster } = require('redis')

const pubClient = createCluster({
    rootNodes: [{ url: process.env.REDIS_URL }]
})
const subClient = createCluster({
    rootNodes: [{ url: process.env.REDIS_URL }]
})

async function connectRedis() {
    await Promise.all([pubClient.connect(), subClient.connect()])
}

module.exports = {
    pubClient,
    subClient,
    connectRedis,
}