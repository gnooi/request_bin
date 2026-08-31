const mongoose = require('mongoose');

const requestPayloadSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    bin_id: { type: String, required: true },
    request_payload: mongoose.Schema.Types.Mixed,
  },
  {
    minimize: false,
    strict: false,
  },
);

module.exports = mongoose.model('Request', requestPayloadSchema, 'requests');
