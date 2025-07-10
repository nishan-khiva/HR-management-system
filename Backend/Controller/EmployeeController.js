const Employee = require('../Models/Employee');

//  Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (err) {
    console.error('Get Employees Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get Single Employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    console.error('Get Single Employee Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit Employee (Update info)
exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee updated', employee: updated });
  } catch (err) {
    console.error('Update Employee Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Delete Employee Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download Employee Resume
exports.downloadResume = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee || !employee.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    // If resume is a URL, redirect. If it's a path, you may need to sendFile (adjust as needed)
    if (employee.resume.startsWith('http')) {
      return res.redirect(employee.resume);
    } else {
      // Adjust the path as per your storage setup
      return res.download(employee.resume);
    }
  } catch (err) {
    console.error('Download Resume Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
