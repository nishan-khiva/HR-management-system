const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  leaveDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  document: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
