const mongoose = require('mongoose');

const requestPayloadSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  bin_id: { type: String, required: true },
  request_payload: {
    method: String,
    path: String,
    headers: mongoose.Schema.Types.Mixed,
    body: mongoose.Schema.Types.Mixed,
    received_at: { type: Date, default: Date.now },
  },
});

module.exports = mongoose.model('Request', requestPayloadSchema, 'requests');
