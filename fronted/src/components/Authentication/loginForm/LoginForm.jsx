import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useUser } from '../../../context/UserContext';
import './LoginForm.css';
import api from '../../../Api/axiosInstance'

const LoginForm = ({ switchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/auth/login', formData);
      if (response.data && response.data.token) {
        const token = response.data.token;
        const userData = response.data.user;
        
  
        localStorage.setItem('token', token);
        
    
        login(userData);
        
    
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-right">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome to Dashboard</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <label htmlFor="email">
          Email Address<span>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

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
            onChange={handleInputChange}
            required
          />
          <span
            className="toggle-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button type="submit" className="login-btn">Login</button>

        <p className="register-link">
          Don't have an account?{' '}
          <span onClick={switchToRegister} className="register-link-text">Register</span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
