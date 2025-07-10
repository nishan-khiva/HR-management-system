import React, { useEffect, useState } from 'react';
import api from '../../Api/axiosInstance';
import './CandidateForm.css';

const CandidateForm = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    declaration: false,
    resume: null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        fullname: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        declaration: false,
        resume: null,
      });
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
    const { name, type, checked, value, files } = e.target;
    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files[0] || null;
    } else {
      newValue = value;
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, phone, position, experience, declaration, resume } = form;

    if (!fullname || !email || !phone || !position || !experience || !declaration || !resume) {
      setError('Please fill all required fields, upload resume, and accept the declaration.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('position', position);
      formData.append('experience', experience);
      formData.append('resume', resume);

      const response = await api.post('/api/candidates/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Candidate added successfully.');
      onSave?.(response.data?.candidate);
      handleClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string'
          ? err.response.data
          : JSON.stringify(err.response?.data)) ||
        'Failed to save candidate.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={`candidate-form-overlay ${isClosing ? 'closing' : ''}`}>
      <form className="candidate-form" onSubmit={handleSubmit}>
        <div className="candidate-form-header">
          <span>Add New Candidate</span>
          <button type="button" className="candidate-form-close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>

        <div className="candidate-form-content">
          <div className="candidate-form-fields">
            {[
              { name: 'fullname', placeholder: 'Full name*' },
              { name: 'email', type: 'email', placeholder: 'Email address*' },
              { name: 'phone', placeholder: 'Phone number*' },
              { name: 'position', placeholder: 'Position*' },
              { name: 'experience', placeholder: 'Experience*' },
              { name: 'resume', placeholder: 'Resume*', type: 'file' }
            ].map(({ name, placeholder, type = 'text' }) => (
              <div key={name} className="candidate-form-field">
                <input
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={type === 'file' ? undefined : form[name]}
                  onChange={handleChange}
                  required={name === 'resume' || name === 'fullname' || name === 'email' || name === 'phone' || name === 'position' || name === 'experience'}
                />
              </div>
            ))}
          </div>

          <div className="candidate-form-declaration">
            <label>
              <input
                type="checkbox"
                name="declaration"
                checked={form.declaration}
                onChange={handleChange}
              />
              <span>I confirm that the above information is correct.</span>
            </label>
          </div>

          {error && <div className="candidate-form-error">{error}</div>}

          <div className="candidate-form-actions">
            <button
              type="submit"
              className="candidate-form-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
