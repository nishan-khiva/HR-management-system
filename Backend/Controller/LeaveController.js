const Leave = require('../models/Leaves');
const Employee = require('../models/Employee');

// Create Leave
const createLeave = async (req, res) => {
  try {
    const { fullname, designation, leaveDate, reason, document } = req.body;

    const employee = await Employee.findOne({ fullname: fullname });

    // if (!employee || employee.attendanceStatus!== 'Present') {
    //   return res.status(400).json({ message: "Only 'Present' employees can apply for leave" });
    // }

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const leave = await Leave.create({
      employee: employee._id,
      designation,
      leaveDate,
      reason,
      document
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Leave Status
const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.status(200).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Leaves
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'fullname designation');
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Approved Leaves (For Calendar View)
const getApprovedLeavesForCalendar = async (req, res) => {
  try {
    const approvedLeaves = await Leave.find({ status: 'Approved' }).populate('employee', 'fullname');
    res.status(200).json(approvedLeaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Leave
const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.status(200).json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createLeave,
  updateLeaveStatus,
  getLeaves,
  getApprovedLeavesForCalendar,
  deleteLeave
};
