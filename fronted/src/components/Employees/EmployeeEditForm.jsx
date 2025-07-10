import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar } from 'react-icons/fi';
import './EmployeeEditForm.css';
import api from '../../Api/axiosInstance';

const positionOptions = [
  'Intern',
  'Designer',
  'Developer',
  'Human Resource',
  'Manager',
  'Team Lead',
  'Other'
];

const EmployeeEditForm = ({ employee, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    doj: '',
    profile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      // Format date for input field (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        fullname: employee.fullname || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
        doj: formatDateForInput(employee.doj),
        profile: employee.profile || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({ ...prev, doj: e.target.value }));
  };

  const isValid =
    formData.fullname.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.position.trim() &&
    formData.department.trim() &&
    formData.doj.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare the payload for the API
      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        doj: formData.doj ? new Date(formData.doj).toISOString() : null
      };

      // Make API call to update employee
      const response = await api.put(`/api/employees/${employee.id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Call the onSave callback with updated data
      onSave && onSave({ ...employee, ...formData });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : JSON.stringify(err.response?.data)) ||
        'Failed to update employee.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="employee-edit-modal-overlay">
      <div className="employee-edit-modal">
        <div className="modal-header purple-header">
          <h2>Edit Employee Details</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="edit-form grid-form">
          <div className="form-group">
            <label>Full Name<span className="required">*</span></label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="purple-input"
            />
          </div>
          <div className="form-group">
            <label>Email Address<span className="required">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="purple-input"
            />
          </div>
          <div className="form-group">
            <label>Phone Number<span className="required">*</span></label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="purple-input"
            />
          </div>
          <div className="form-group">
            <label>Department<span className="required">*</span></label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="purple-input"
            />
          </div>
          <div className="form-group">
            <label>Position<span className="required">*</span></label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="purple-input"
            >
              <option value="" disabled>Select Position</option>
              {positionOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date of Joining<span className="required">*</span></label>
            <div className="date-input-wrapper">
              <input
                type="date"
                name="doj"
                value={formData.doj}
                onChange={handleDateChange}
                required
                className="purple-input"
                style={{ paddingRight: 32 }}
              />
              {/* <FiCalendar className="date-icon" /> */}
            </div>
          </div>
          {error && <div className="form-error" style={{ color: '#f44336', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
          <div className="form-actions">
            <button
              type="submit"
              className="save-btn purple-btn"
              disabled={!isValid || loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEditForm; 