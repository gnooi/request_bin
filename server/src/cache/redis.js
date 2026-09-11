// const { createCluster } = require('redis')

// const pubClient = createCluster({
//     rootNodes: [{ url: process.env.REDIS_URL }]
// })
// const subClient = createCluster({
//     rootNodes: [{ url: process.env.REDIS_URL }]
// })

// async function connectRedis() {
//     console.log('REDIS_URL at construction time:', process.env.REDIS_URL)
//     console.log('Connecting pubClient...');
//     await pubClient.connect();
//     console.log('pubClient connected');

//     console.log('Connecting subClient...');
//     await subClient.connect();
//     console.log('subClient connected');
// }

// module.exports = {
//     pubClient,
//     subClient,
//     connectRedis,
// }