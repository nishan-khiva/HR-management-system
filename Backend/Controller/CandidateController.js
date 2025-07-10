const Candidate = require('../Models/Candidate');
const Employee = require('../Models/Employee')

// Create Candidate with Cloudinary resume
exports.createCandidate = async (req, res) => {
  try {
    const { fullname, email, phone, position, experience } = req.body;
    const resume = req.file;

    if (!resume) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const candidate = new Candidate({
      fullname,
      email,
      phone,
      position,
      experience,
      resume: resume.path, 
    });

    await candidate.save();
    res.status(201).json({ message: 'Candidate created successfully', candidate });
  } catch (err) {
    console.error('Create Candidate Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get All Candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (err) {
    console.error('Get Candidates Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get Single Candidate
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    res.status(200).json(candidate);
  } catch (err) {
    console.error('Get Single Candidate Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Update Candidate Status
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.status(200).json({ message: 'Status updated successfully', candidate });
  } catch (err) {
    console.error('Update Candidate Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Delete Candidate
exports.deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    console.error('Delete Candidate Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Download Resume (from Cloudinary)
exports.downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resumeUrl) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.redirect(candidate.resumeUrl); 
  } catch (err) {
    console.error('Resume Download Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


//  Convert Candidate to Employee
exports.promoteToEmployee = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    // Update candidate status
    candidate.status = 'Selected';
    await candidate.save();

    // Find the latest employee by createdAt or employeeId
    const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

    let newEmployeeId = 101; // default start

    if (lastEmployee && lastEmployee.employeeId) {
      const lastId = parseInt(lastEmployee.employeeId);
      newEmployeeId = isNaN(lastId) ? 101 : lastId + 1;
    }

    const newEmployee = new Employee({
      fullname: candidate.fullname,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      role: 'Employee',
      experience: candidate.experience,
      attendanceStatus: 'Present',
      employeeId: newEmployeeId.toString(), // stored as string
      resume: candidate.resume,
    });

    await newEmployee.save();

    res.status(201).json({ message: 'Candidate promoted to employee', employee: newEmployee });
  } catch (err) {
    console.error('Promote Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


