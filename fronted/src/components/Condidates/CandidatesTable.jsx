import React, { useState, useEffect } from 'react';
import { FiDownload, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import api from '../../Api/axiosInstance';
import './CandidatesTable.css';

const statusOptions = ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];

const getStatusColor = (status) => {
  switch (status) {
    case 'New': return '#2196f3';
    case 'Scheduled': return '#ff9800';
    case 'Ongoing': return '#9c27b0';
    case 'Selected': return '#4caf50';
    case 'Rejected': return '#f44336';
    default: return '#757575';
  }
};

const CandidatesTable = ({ candidates = [], onEdit, onDelete, onDownload, onStatusChange, onRefresh }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenu = (id, event) => {
    if (menuOpen === id) return setMenuOpen(null);

    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const menuHeight = 120;
    const shouldShowAbove = window.innerHeight - buttonRect.bottom < menuHeight;

    setMenuPosition((prev) => ({
      ...prev,
      [id]: shouldShowAbove ? 'above' : 'below',
    }));

    setMenuOpen(id);
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    if (onStatusChange) {
      onStatusChange(candidateId, newStatus);
    }
    setMenuOpen(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-menu-container')) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (candidates.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">No candidates found</h3>
        <p className="empty-state-message">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 12, 
      boxShadow: '0 2px 8px #eee',
      margin: isMobile ? '4px' : '8px'
    }}>
      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr style={{ background: '#4B1979', color: '#fff' }}>
              <th style={thStyle}>Sr No.</th>
              <th style={thStyle}>Candidate Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Position</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Experience</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, idx) => (
              <tr
                key={candidate._id}
                style={{
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={tdStyle}>{String(idx + 1).padStart(2, '0')}</td>
                <td style={{ ...tdStyle, fontWeight: 500 }}>
                  <div style={{ 
                    maxWidth: isMobile ? '80px' : '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {candidate.fullname}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ 
                    maxWidth: isMobile ? '100px' : '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {candidate.email}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ 
                    maxWidth: isMobile ? '80px' : '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {candidate.phone}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ 
                    maxWidth: isMobile ? '80px' : '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {candidate.position}
                  </div>
                </td>
                <td style={tdStyle}>
                  <select
                    value={candidate.status}
                    onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                    disabled={candidate.status === 'Selected' || candidate.status === 'Rejected'}
                    style={{
                      borderRadius: 20,
                      padding: isMobile ? '2px 6px' : '4px 12px',
                      border: '1px solid #ccc',
                      background: candidate.status === 'Selected' || candidate.status === 'Rejected' ? '#f5f5f5' : '#fff',
                      color: getStatusColor(candidate.status),
                      fontWeight: 500,
                      cursor: candidate.status === 'Selected' || candidate.status === 'Rejected' ? 'not-allowed' : 'pointer',
                      fontSize: isMobile ? '10px' : '12px',
                      minWidth: isMobile ? '60px' : '80px',
                      maxWidth: isMobile ? '80px' : '100px'
                    }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={tdStyle}>
                  <div style={{ 
                    maxWidth: isMobile ? '60px' : '80px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'}
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center', position: 'relative' }}>
                  <div className="action-menu-container">
                    <button 
                      onClick={(e) => handleMenu(candidate._id, e)} 
                      className="action-menu-btn"
                      style={{
                        padding: isMobile ? '4px' : '8px',
                        fontSize: isMobile ? '14px' : '18px'
                      }}
                    >
                      <FiMoreVertical size={isMobile ? 14 : 16} />
                    </button>
                    {menuOpen === candidate._id && (
                      <div className={`action-menu ${menuPosition[candidate._id] === 'above' ? 'above' : ''}`}>
                        <div
                          className="action-menu-item"
                          onClick={() => {
                            onDownload && onDownload(candidate);
                            setMenuOpen(null);
                          }}
                        >
                          <FiDownload size={isMobile ? 12 : 14} /> 
                          {isMobile ? 'Download' : 'Download Resume'}
                        </div>
                        <div
                          className="action-menu-item delete"
                          onClick={() => {
                            onDelete && onDelete(candidate);
                            setMenuOpen(null);
                          }}
                        >
                          <FiTrash2 size={isMobile ? 12 : 14} /> 
                          {isMobile ? 'Delete' : 'Delete Candidate'}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = {
  padding: '16px 12px',
  textAlign: 'left',
  fontWeight: 600
};

const tdStyle = {
  padding: '16px 12px',
  color: '#555'
};

export default CandidatesTable;
