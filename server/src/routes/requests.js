const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const {
  recordRequest,
  getBinRequests,
  getRawRequest,
} = require('../controllers/requestsController');
const parseBody = require('../middleware/parseBody');

router.all(
  '/capture/:bin_name',
  express.text({ type: '*/*', limit: '10mb' }),
  parseBody,
  recordRequest,
);
// health check
router.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})
router.get('/api/bins/:bin_name/requests', authenticate, getBinRequests);
router.get('/api/bins/:bin_name/requests/:id/raw', authenticate, getRawRequest);

module.exports = router;
