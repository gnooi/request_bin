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
  '/:bin_name',
  express.text({ type: '*/*', limit: '10mb' }),
  parseBody,
  recordRequest,
);
router.get('/api/bins/:bin_name/requests', authenticate, getBinRequests);
router.get('/api/bins/:bin_name/requests/:id/raw', authenticate, getRawRequest);

module.exports = router;
