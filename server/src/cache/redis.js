const { createCluster } = require('redis')

const pubClient = createCluster({
    rootNodes: [
        {
            url: process.env.REDIS_URL
        }
    ]
})
const subClient = pubClient.duplicate()

async function connectRedis() {
    await Promise.all([pubClient.connect(), subClient.connect()])
}

module.exports = {
    pubClient,
    subClient,
    connectRedis,
}