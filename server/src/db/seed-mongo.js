// server/db/seed-mongo.js
db = db.getSiblingDB('requestbin');

db.requests.deleteMany({});

const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

db.requests.insertMany([
  // Bin 1 (bin_a1b2c3d4)
  {
    _id: 1,
    bin_id: '1',
    request_payload: {
      method: 'GET',
      path: '/',
      headers: {
        host: 'bin_a1b2c3d4.requestbin.io',
        'user-agent': 'curl/8.4.0',
        accept: '*/*',
      },
      body: null,
      received_at: new Date(now - 3 * DAY + 2 * MIN),
    },
  },
  {
    _id: 2,
    bin_id: '1',
    request_payload: {
      method: 'POST',
      path: '/webhook',
      headers: {
        host: 'bin_a1b2c3d4.requestbin.io',
        'content-type': 'application/json',
        'user-agent': 'PostmanRuntime/7.36.0',
      },
      body: { event: 'payment.succeeded', amount: 2599, currency: 'usd' },
      received_at: new Date(now - 3 * DAY + 10 * MIN),
    },
  },
  {
    _id: 3,
    bin_id: '1',
    request_payload: {
      method: 'PUT',
      path: '/webhook/1234',
      headers: {
        host: 'bin_a1b2c3d4.requestbin.io',
        'content-type': 'application/json',
      },
      body: { status: 'updated' },
      received_at: new Date(now - 2 * DAY),
    },
  },

  // Bin 2 (bin_e5f6g7h8)
  {
    _id: 4,
    bin_id: '2',
    request_payload: {
      method: 'POST',
      path: '/notify',
      headers: {
        host: 'bin_e5f6g7h8.requestbin.io',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'event=deploy&status=success', // raw string, not parsed — matches content-type
      received_at: new Date(now - 1 * DAY + 30 * MIN),
    },
  },

  // Bin 3 (bin_i9j0k1l2)
  {
    _id: 5,
    bin_id: '3',
    request_payload: {
      method: 'GET',
      path: '/health',
      headers: {
        host: 'bin_i9j0k1l2.requestbin.io',
        'user-agent': 'kube-probe/1.29',
      },
      body: null,
      received_at: new Date(now - 5 * HOUR),
    },
  },
  {
    _id: 6,
    bin_id: '3',
    request_payload: {
      method: 'DELETE',
      path: '/resource/42',
      headers: {
        host: 'bin_i9j0k1l2.requestbin.io',
        authorization: 'Bearer redacted',
      },
      body: null,
      received_at: new Date(now - 1 * HOUR),
    },
  },

  // Bin 4 (bin_m3n4o5p6) intentionally has no requests, matching Postgres
]);

print('Seeded ' + db.requests.countDocuments() + ' request documents.');
