import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserFriends, FaUsers, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import { MdOutlineLogout } from 'react-icons/md';
import { FiX } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('token'); 
    navigate('/');
  };

  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile close button */}
      {isMobile && (
        <button 
          className="sidebar-close" 
          onClick={onClose}
          aria-label="Close menu"
        >
          <FiX />
        </button>
      )}

      <div className="sidebar-logo">
        <span className="logo-box"></span>
        <span className="logo-text">LOGO</span>
      </div>

      <input className="sidebar-search" placeholder="Search" />

      <div className="sidebar-section">
        <div className="sidebar-section-title">Recruitment</div>
        <NavLink 
          to="candidates" 
          className="sidebar-link"
          onClick={handleNavClick}
        >
          <FaUserFriends /> Candidates
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Organization</div>
        <NavLink 
          to="employees" 
          className="sidebar-link"
          onClick={handleNavClick}
        >
          <FaUsers /> Employees
        </NavLink>
        <NavLink 
          to="attendance" 
          className="sidebar-link"
          onClick={handleNavClick}
        >
          <FaCalendarAlt /> Attendance
        </NavLink>
        <NavLink 
          to="leaves" 
          className="sidebar-link"
          onClick={handleNavClick}
        >
          <FaClipboardList /> Leaves
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Others</div>
        <button onClick={handleLogOut} className="logout-btn">
          <MdOutlineLogout /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
