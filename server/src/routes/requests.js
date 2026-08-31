const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');

router.all('/:bin_name', requestsController.recordRequest);
router.get('/api/bins/:bin_name/requests', requestsController.getBinRequests);
router.get(
  '/api/bins/:bin_name/requests/:id/raw',
  requestsController.getRawRequest,
);

module.exports = router;
