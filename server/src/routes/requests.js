const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');
const parseBody = require('../middleware/parseBody');

router.all(
  '/:bin_name',
  express.text({ type: '*/*', limit: '10mb' }),
  parseBody,
  requestsController.recordRequest,
);
router.get('/api/bins/:bin_name/requests', requestsController.getBinRequests);
router.get(
  '/api/bins/:bin_name/requests/:id/raw',
  requestsController.getRawRequest,
);

module.exports = router;
