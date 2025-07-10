const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  date: String,
  status: { type: String, enum: ['Present', 'Absent'] },
  task: { type: String, default: 'No Task Assigned' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
