import React, { useState, useEffect } from 'react';
import './AddLeaveModel.css';
import { FiUpload, FiCalendar } from 'react-icons/fi';
import api from '../../Api/axiosInstance';

const initialForm = {
  employeeName: '',
  designation: '',
  leaveDate: '',
  reason: '',
  documents: null,
};

const AddLeaveModel = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setError('');
      setLoading(false);
      setIsClosing(false);
    }
  }, [open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 300);
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeName, designation, leaveDate, reason, documents } = form;
    if (!employeeName || !designation || !leaveDate || !reason) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Prepare form data for API
      const payload = {
        fullname: employeeName,
        designation,
        leaveDate,
        reason,
        document: documents ? documents.name : '', // Only file name for now
      };
      const response = await api.post('api/leaves/create', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Map backend response to table format
      const leave = response.data;
      const mapped = {
        id: leave._id,
        profile: '',
        name: form.employeeName,
        designation: form.designation,
        date: leave.leaveDate ? new Date(leave.leaveDate).toLocaleDateString() : '',
        reason: leave.reason,
        status: leave.status,
        docs: leave.document || '',
      };
      onSave?.(mapped);
      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : JSON.stringify(err.response?.data)) ||
        'Failed to create leave.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={`addleave-overlay ${isClosing ? 'closing' : ''}`}>
      <form className="addleave-form" onSubmit={handleSubmit}>
        <div className="addleave-header">
          <span>Add New Leave</span>
          <button type="button" className="addleave-close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="addleave-content">
          <div className="addleave-fields">
            <div className="addleave-field">
              <input
                name="employeeName"
                type="text"
                placeholder="Search Employee Name*"
                value={form.employeeName}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="addleave-field">
              <input
                name="designation"
                type="text"
                placeholder="Designation*"
                value={form.designation}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="addleave-field date-field">
              <input
                name="leaveDate"
                type="date"
                placeholder="Leave Date*"
                value={form.leaveDate}
                onChange={handleChange}
                autoComplete="off"
              />
              <span className="icon-right"><FiCalendar /></span>
            </div>
            <div className="addleave-field file-input-container">
              <label className="custom-file-label">
                Documents
                <input
                  type="file"
                  name="documents"
                  className="hidden-file-input"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleChange}
                />
                <span className="upload-icon"><FiUpload /></span>
              </label>
              {form.documents && (
                <span className="file-selected">{form.documents.name}</span>
              )}
            </div>
            <div className="addleave-field reason-field">
              <input
                name="reason"
                type="text"
                placeholder="Reason*"
                value={form.reason}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          </div>
          {error && <div className="addleave-error">{error}</div>}
          <div className="addleave-actions">
            <button
              type="submit"
              className="addleave-btn"
              disabled={loading || !form.employeeName || !form.designation || !form.leaveDate || !form.reason}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLeaveModel;
