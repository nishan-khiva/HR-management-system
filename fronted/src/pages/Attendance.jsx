import React, { useEffect, useState } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2, FiChevronDown } from 'react-icons/fi';
import '../components/Attendance/Attendance.css';
import Header from '../components/Header/Header';
import axios from 'axios';

const statusOptions = ['All', 'Present', 'Absent', 'Half Day'];

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [rowStatusDropdown, setRowStatusDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Fetch employee attendance on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        const employeesArr = response.data || [];
        const attendanceData = employeesArr.map(employee => ({
          id: employee._id,
          name: employee.fullname || employee.fullName || '',
          email: employee.email || '',
          phone: employee.phone || '',
          position: employee.position || '',
          department: employee.department || '-',
          task: employee.task || '-',
          status: employee.attendanceStatus || 'Absent', // ✅ Corrected mapping here
          profile: employee.profile || `https://ui-avatars.com/api/?name=${employee.fullname}`,
        }));
        setAttendance(attendanceData);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Handle search + filter
  const filteredAttendance = attendance.filter(emp => {
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.task.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // ✅ Handle status update
  const handleStatusChange = (id, newStatus) => {
    setAttendance(prev =>
      prev.map(emp => (emp.id === id ? { ...emp, status: newStatus } : emp))
    );
    setRowStatusDropdown(null);
  };

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (!event.target.closest('.attendance-action-menu-container')) setMenuOpen(null);
      if (!event.target.closest('.attendance-status-filter-dropdown')) setStatusDropdownOpen(false);
      if (!event.target.closest('.attendance-row-status-dropdown')) setRowStatusDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <Header title="Attendance" count={filteredAttendance.length} />

      <div className="menubar" style={{ marginBottom: 0 }}>
        {/* 🔽 Status Dropdown */}
        <div className="attendance-status-filter-dropdown" style={{ position: 'relative' }}>
          <button
            className="dropdown-btn"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            style={{ minWidth: 140 }}
          >
            Status
            <span style={{ marginLeft: 8 }}>{statusFilter !== 'All' ? statusFilter : ''}</span>
            <FiChevronDown size={14} style={{ marginLeft: 8 }} />
          </button>
          {statusDropdownOpen && (
            <div className="dropdown-menu" style={{ minWidth: 160 }}>
              {statusOptions.map(option => (
                <div
                  key={option}
                  className="dropdown-item"
                  onClick={() => {
                    setStatusFilter(option);
                    setStatusDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔍 Search Input */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ minWidth: 220 }}
        />
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map(emp => (
              <tr key={emp.id}>
                <td>
                  <img src={emp.profile} alt={emp.name} className="attendance-profile-img" />
                </td>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.task}</td>
                <td style={{ position: 'relative' }}>
                  <div className="attendance-row-status-dropdown">
                    <button
                      className={`attendance-status-btn ${emp.status === 'Absent' ? 'absent' : ''}`}
                      onClick={() => setRowStatusDropdown(rowStatusDropdown === emp.id ? null : emp.id)}
                    >
                      {emp.status}
                      <FiChevronDown size={14} style={{ marginLeft: 8 }} />
                    </button>
                    {rowStatusDropdown === emp.id && (
                      <div className="attendance-status-dropdown">
                        {statusOptions
                          .filter(opt => opt !== 'All')
                          .map(option => (
                            <div
                              key={option}
                              className="attendance-status-option"
                              onClick={() => handleStatusChange(emp.id, option)}
                            >
                              {option}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ position: 'relative', textAlign: 'center' }}>
                  <div className="attendance-action-menu-container">
                    <button
                      className="action-menu-btn"
                      onClick={() => setMenuOpen(menuOpen === emp.id ? null : emp.id)}
                    >
                      <FiMoreVertical size={16} />
                    </button>
                    {menuOpen === emp.id && (
                      <div className="attendance-action-menu">
                        <div
                          className="attendance-action-menu-item"
                          onClick={() => {
                            // handle edit
                            setMenuOpen(null);
                          }}
                        >
                          <FiEdit size={14} /> Edit
                        </div>
                        <div
                          className="attendance-action-menu-item delete"
                          onClick={() => {
                            setAttendance(prev => prev.filter(e => e.id !== emp.id));
                            setMenuOpen(null);
                          }}
                        >
                          <FiTrash2 size={14} /> Delete
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!filteredAttendance.length && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
