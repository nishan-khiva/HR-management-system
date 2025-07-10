require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./models/DBconnection')

// Import routes
const authRoutes = require('./Routers/AuthRoutes');
const candidateRoutes = require('./Routers/CandidateRoutes');
const employeeRoutes = require('./Routers/EmployeeRoutes');
const leaveRoutes = require('./Routers/LeavesRoutes');
const attendanceRoutes = require('./Routers/AttendanceRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 }); 