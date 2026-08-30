const express = require('express');
const router = express.Router();
const { getPool } = require('../db/postgres');
const Request = require('../../models/RequestPayload');
// const { broadcastToBin } = require('../ws');

router.all('/:bin_name', async (req, res) => {
  const { bin_name } = req.params;

  try {
    const binResult = await pool.query(
      'SELECT id FROM bins WHERE bin_name = $1',
      [bin_name],
    );

    if (binResult.rows.length === 0) {
      return res.sendStatus(404);
    }

    const binId = binResult.rows[0].id;

    const insertResult = await getPool.query(
      `INSERT INTO requests (bin_id, method, path, headers, body)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, received_at`,
      [
        binId,
        req.method,
        req.path,
        JSON.stringify(req.headers),
        typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      ],
    );
    const { id: requestId, received_at } = insertResult.rows[0];

    await getPool.query(
      'UPDATE bins SET request_count = request_count + 1 WHERE id = $1',
      [binId],
    );

    await Request.create({
      _id: requestId,
      bin_id: String(binId),
      request_payload: {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body,
        received_at,
      },
    });

    // broadcastToBin(bin_name, {
    //   id: requestId,
    //   method: req.method,
    //   path: req.path,
    //   received_at,
    // });

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error capturing request:', err);
    res.sendStatus(500);
  }
});

router.get('/api/bins/:bin_name/requests', async (req, res) => {
  const { bin_name } = req.params;

  try {
    const binResult = await getPool.query(
      'SELECT id FROM bins WHERE bin_name = $1',
      [bin_name],
    );

    if (binResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bin not found' });
    }

    const binId = binResult.rows[0].id;

    const requestsResult = await getPool.query(
      `SELECT id, method, path, received_at 
      FROM requests
      WHERE bin_id = $1
      ORDER BY received_at DESC`,
      [binId],
    );

    res.status(200).json(requestsResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/api/bins/:bin_name/requests/:id/raw', async (req, res) => {
  const { bin_name, id } = req.params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    return res.sendStatus(404);
  }

  try {
    const doc = await Request.findOne({ _id: Number(id) });

    if (!doc) {
      return res.sendStatus(404);
    }

    res.status(200).json({ request_payload: doc.request_payload });
  } catch (err) {
    console.error('Error fetching raw request:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
