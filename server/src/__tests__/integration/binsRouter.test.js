const request = require('supertest');

const mockClient = { query: jest.fn() };

jest.mock('../../db/postgres', () => ({
  getPool: () => mockClient,
}));

const { app } = require('../../app');

function queueQueryResults(resultsByName) {
  mockClient.query.mockImplementation(async (query) => {
    if (Object.prototype.hasOwnProperty.call(resultsByName, query.name)) {
      return resultsByName[query.name];
    }
    throw new Error(`Unexpected query in test: ${query.name}`);
  });
}

describe('GET /api/bins', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 401 when no authorization header is provided', async () => {
    const response = await request(app).get('/api/bins');

    expect(response.status).toBe(401);
    expect(response.body.error).toBeDefined();
  });

  test('returns 401 when the authorization type is not Bearer', async () => {
    const response = await request(app)
      .get('/api/bins')
      .set('Authorization', 'Basic sometoken');

    expect(response.status).toBe(401);
  });

  test('returns 401 when the token does not match a user', async () => {
    queueQueryResults({ fetch_user_id: { rows: [] } });

    const response = await request(app)
      .get('/api/bins')
      .set('Authorization', 'Bearer badtoken');

    expect(response.status).toBe(401);
  });

  test('returns 200 with the bins for the authenticated user', async () => {
    queueQueryResults({
      fetch_user_id: { rows: [{ id: 1 }] },
      'fetch bins for user': {
        rows: [
          {
            id: 5,
            bin_name: 'my_bin',
            request_count: 2,
            created_at: '2026-01-01',
            user_id: 1,
          },
        ],
      },
    });

    const response = await request(app)
      .get('/api/bins')
      .set('Authorization', 'Bearer goodtoken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 5,
        bin_name: 'my_bin',
        request_count: 2,
        created_at: '2026-01-01',
      },
    ]);
  });
});

describe('POST /api/bins', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 401 when no authorization header is provided', async () => {
    const response = await request(app)
      .post('/api/bins')
      .send({ url_endpoint: 'new_endpoint' });

    expect(response.status).toBe(401);
  });

  test('returns 400 when url_endpoint is missing', async () => {
    queueQueryResults({ fetch_user_id: { rows: [{ id: 1 }] } });

    const response = await request(app)
      .post('/api/bins')
      .set('Authorization', 'Bearer goodtoken')
      .send({});

    expect(response.status).toBe(400);
  });

  test('returns 400 when url_endpoint has invalid characters', async () => {
    queueQueryResults({ fetch_user_id: { rows: [{ id: 1 }] } });

    const response = await request(app)
      .post('/api/bins')
      .set('Authorization', 'Bearer goodtoken')
      .send({ url_endpoint: 'bad-endpoint!' });

    expect(response.status).toBe(400);
  });

  test('returns 409 when url_endpoint is already taken', async () => {
    queueQueryResults({
      fetch_user_id: { rows: [{ id: 1 }] },
      'check if endpoint exists in bins': {
        rows: [{ id: 2, bin_name: 'taken_name' }],
      },
    });

    const response = await request(app)
      .post('/api/bins')
      .set('Authorization', 'Bearer goodtoken')
      .send({ url_endpoint: 'taken_name' });

    expect(response.status).toBe(409);
  });

  test('returns 201 and the created bin on success', async () => {
    queueQueryResults({
      fetch_user_id: { rows: [{ id: 1 }] },
      'check if endpoint exists in bins': { rows: [] },
      'adding bin to user': {
        rows: [{ id: 9, bin_name: 'new_endpoint', user_id: 1 }],
      },
    });

    const response = await request(app)
      .post('/api/bins')
      .set('Authorization', 'Bearer goodtoken')
      .send({ url_endpoint: 'new_endpoint' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 9, url_endpoint: 'new_endpoint' });
  });
});
