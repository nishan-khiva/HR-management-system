const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phone: String,
  position: String,
  role: { type: String, default: 'Employee' },
  experience: { type: Number, default: 0 }, 
  attendanceStatus: { type: String, default: 'Present' }, 
  task: String,
  department: {type:String, default: 'IT'},
  doj: { type: Date, default: Date.now },
  employeeId: { type: String, unique: true,},
  resume: String,
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
