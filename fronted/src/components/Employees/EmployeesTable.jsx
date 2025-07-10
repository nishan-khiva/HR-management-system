import React, { useState, useEffect } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2, FiDownload, FiChevronDown } from 'react-icons/fi';
import api from '../../Api/axiosInstance';
import './EmployeeTable.css';
import EmployeeEditForm from './EmployeeEditForm';

const positionOptions = ['All', 'Designer', 'Developer', 'Human Resource', 'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];

const EmployeesTable = ({ employees, fetchEmployees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(null);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.emp-action-menu-container')) {
        setMenuOpen(null);
      }
      if (!event.target.closest('.emp-position-dropdown-container')) {
        setPositionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'All' || emp.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const handleDelete = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/api/employees/${employee.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchEmployees();
        setMenuOpen(null);
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleDownloadResume = (employee) => {
    if (employee.resume) {
      // Download from backend API
      const link = document.createElement('a');
      link.href = `/api/employees/${employee.id}/download-resume`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No resume available for download.');
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
    setMenuOpen(null);
  };

  return (
    <>
      <div className="menubar" style={{ marginBottom: 0 }}>
        {/* Position Dropdown */}
        <div className="emp-position-dropdown-container" style={{ position: 'relative' }}>
          <button
            className="dropdown-btn"
            onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
            style={{ minWidth: 140 }}
          >
            Position
            <span style={{ marginLeft: 8 }}>{positionFilter !== 'All' ? positionFilter : ''}</span>
            <FiChevronDown size={14} style={{ marginLeft: 8 }} />
          </button>
          {positionDropdownOpen && (
            <div className="dropdown-menu" style={{ minWidth: 160 }}>
              {positionOptions.map(option => (
                <div
                  key={option}
                  className="dropdown-item"
                  onClick={() => {
                    setPositionFilter(option);
                    setPositionDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="employees-table-container">
        {filteredEmployees.length === 0 ? (
          <div style={{ 
            background: '#fff', 
            borderRadius: 12, 
            boxShadow: '0 2px 8px #eee', 
            padding: 48, 
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <h3>No employees found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <table className="employees-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Position</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Date of Joining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td><img src={emp.profile} alt={emp.name} className="employees-profile-img" /></td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.fullname}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  <td>{emp.experience} years</td>
                  <td>{emp.doj ? new Date(emp.doj).toLocaleDateString() : 'N/A'}</td>
                  <td style={{ position: 'relative', textAlign: 'center' }}>
                    <div className="emp-action-menu-container">
                      <button
                        className="action-menu-btn"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuOpen(menuOpen === emp.id ? null : emp.id);
                          if (menuOpen !== emp.id) {
                            // Position the dropdown
                            const dropdown = document.querySelector('.emp-action-menu');
                            if (dropdown) {
                              dropdown.style.left = `${rect.left - 110}px`;
                              dropdown.style.top = `${rect.bottom + 5}px`;
                            }
                          }
                        }}
                      >
                        <FiMoreVertical size={16} />
                      </button>
                      {menuOpen === emp.id && (
                        <div className="emp-action-menu">
                          <div
                            className="emp-action-menu-item"
                            onClick={() => handleEdit(emp)}
                          >
                            <FiEdit size={14} /> Edit
                          </div>
                          <div
                            className="emp-action-menu-item"
                            onClick={() => handleDownloadResume(emp)}
                          >
                            <FiDownload size={14} /> Download Resume
                          </div>
                          <div
                            className="emp-action-menu-item delete"
                            onClick={() => handleDelete(emp)}
                          >
                            <FiTrash2 size={14} /> Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editModalOpen && (
        <EmployeeEditForm
          employee={selectedEmployee}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={(updatedEmployee) => {
            fetchEmployees();
            setEditModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default EmployeesTable; 