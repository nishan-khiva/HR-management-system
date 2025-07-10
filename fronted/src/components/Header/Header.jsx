import React, { useState } from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useUser } from "../../context/UserContext";
import './Header.css';

const Header = ({ title, count }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentUser, logout } = useUser();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    // You can add navigation logic here if needed
  };

  return (
    <div className='header'>
      <h2>{title}</h2>
      <div className='header-icons'>
        <MdOutlineEmail className="header-icon" />
        <FaBell className="header-icon" />
        <div className="profile-dropdown-container">
          <div 
            className="profile-dropdown-trigger"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            {currentUser && currentUser.profile ? (
              <img 
                src={currentUser.profile} 
                alt={currentUser.name}
                className="user-profile-img"
              />
            ) : (
              <div className="user-profile-placeholder">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            )}
            <HiOutlineChevronDown className="header-icon" />
          </div>
          {profileDropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="profile-dropdown-header">
                <img 
                  src={currentUser?.profile} 
                  alt={currentUser?.name}
                  className="dropdown-profile-img"
                />
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">{currentUser?.name}</div>
                  <div className="dropdown-user-role">{currentUser?.position}</div>
                </div>
              </div>
              <div className="profile-dropdown-item">Profile</div>
              <div className="profile-dropdown-item">Settings</div>
              <div className="profile-dropdown-item" onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header; 