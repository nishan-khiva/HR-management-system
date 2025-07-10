const Attendance = require('../Models/Attendance');
const Employee = require('../Models/Employee');

//  Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { fullname, status } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const employee = await Employee.findOne({ name: fullname });

    if (!employee || employee.status !== 'Present') {
      return res.status(400).json({ message: "Only 'Present' employees can mark attendance" });
    }

    const existing = await Attendance.findOne({ employee: employee._id, date: today });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    const attendance = await Attendance.create({
      employee: employee._id,
      date: today,
      status: status || 'Present'
    });

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get All Attendance (with optional filters)
const getAllAttendance = async (req, res) => {
  try {
    const { status, date } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (date) filter.date = new Date(date);

    const attendanceRecords = await Attendance.find(filter)
      .populate('employee', 'name designation')
      .sort({ date: -1 });

    res.status(200).json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  markAttendance,
  getAllAttendance
};
