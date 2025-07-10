const express = require('express');
const router = express.Router();
const AttendanceController = require('../Controller/AttendanceController');

// Routes
router.post('/mark', AttendanceController.markAttendance); // localhost:5000/api/attendance/mark
router.get('/', AttendanceController.getAllAttendance);

module.exports = router;
