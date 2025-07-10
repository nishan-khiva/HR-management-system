import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './RegisterForm.css';
import api from '../../../Api/axiosInstance';

const RegisterForm = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/api/auth/register', formData);
      if (response?.data) {
        alert('Registered Successfully');
        switchToLogin(); // optional
      }
    } catch (error) {
      console.error('Registration Error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-right">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Welcome to Dashboard</h2>

        {/* Full Name */}
        <label htmlFor="fullname">
          Full Name<span>*</span>
        </label>
        <input
          type="text"
          id="fullname"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <label htmlFor="email">
          Email Address<span>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <label htmlFor="password">
          Password<span>*</span>
        </label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <label htmlFor="confirmpassword">
          Confirm Password<span>*</span>
        </label>
        <div className="password-wrapper">
          <input
            type={showConfirm ? 'text' : 'password'}
            id="confirmpassword"
            name="confirmpassword"
            placeholder="Confirm Password"
            value={formData.confirmpassword}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-icon"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        {/* Submit Button */}
        <button type="submit" className="register-btn">Register</button>

        {/* Switch to Login */}
        <p className="login-link">
          Already have an account?{' '}
          <span onClick={switchToLogin} className="login-link-text">Login</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
