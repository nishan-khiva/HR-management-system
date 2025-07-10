const express = require('express');
const LeaveController = require('../Controller/LeaveController');

const router = express.Router();

router.post('/create', LeaveController.createLeave); // HR create leave
router.patch('/status/:leaveId', LeaveController.updateLeaveStatus); // HR update status
router.get('/', LeaveController.getLeaves); // List leaves with filters
router.get('/calendar/approved', LeaveController.getApprovedLeavesForCalendar); // Only approved leaves
router.delete('/:id', LeaveController.deleteLeave); // Delete leave

module.exports = router;
