import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import '../components/Condidates/Condidates.css';
import Header from '../components/Header/Header';
import api from '../Api/axiosInstance';

import CandidatesTable from '../components/Condidates/CandidatesTable';
import CandidateForm from '../components/Condidates/CandidateForm';


const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });
  const [newDropdownOpen, setNewDropdownOpen] = useState(false);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Filter options
  const statusOptions = ['All', 'New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];
  const positionOptions = ['All', 'HR', 'Developer', 'Human Resource', 'Designer', 'Manager'];

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to refresh candidates 
  const refreshCandidates = async () => {
    try {
      const response = await api.get('/api/candidates');
      setCandidates(response.data);
    } catch (error) {
      console.error('Error refreshing candidates:', error);
    }
  };

  // Handle candidate save 
  const handleCandidateSave = async (newCandidate) => {
    // Refresh the candidates list
    await refreshCandidates();
    setFormOpen(false);
  };

  // Handle candidate delete
  const handleDelete = async (candidate) => {
    if (window.confirm(`Are you sure you want to delete ${candidate.fullname}?`)) {
      try {
        await api.delete(`/api/candidates/${candidate._id}`);
        await refreshCandidates();
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  // Handle candidate download
  const handleDownload = (candidate) => {
    if (candidate.resume) {
      const link = document.createElement('a');
      link.href = candidate.resume;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No resume available for download.');
    }
  };

  // Show feedback helper function
  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 3000);
  };

  // Handle status change
  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      // First update the status
      await api.patch(`/api/candidates/${candidateId}/status`, { status: newStatus });
      
      // If status is changed to "Selected", promote the candidate to employee
      if (newStatus === 'Selected') {
        try {
          const promoteResponse = await api.post(`/api/candidates/promote/${candidateId}`);
          console.log('Candidate promoted to employee:', promoteResponse.data);
          
          // Show success message
          if (promoteResponse.data && promoteResponse.data.employee) {
            showFeedback(` Candidate selected and converted to employee! Employee ID: ${promoteResponse.data.employee.employeeId}`, 'success');
          } else {
            showFeedback('Candidate selected successfully!', 'success');
          }
        } catch (promoteError) {
          console.error('Error promoting candidate:', promoteError);
          showFeedback('Status updated but failed to promote candidate to employee. Please try again.', 'error');
        }
      } else {
        showFeedback('Status updated successfully!', 'success');
      }
      
      // Refresh the candidates list
      await refreshCandidates();
    } catch (error) {
      console.error('Error updating candidate status:', error);
      showFeedback('Failed to update candidate status. Please try again.', 'error');
    }
  };

  // Initial data fetch
  useEffect(() => {
    refreshCandidates();
  }, []);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setNewDropdownOpen(false);
        setPositionDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter('All');
    setPositionFilter('All');
    setSearchTerm('');
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== 'All' || positionFilter !== 'All' || searchTerm !== '';

  // Filter candidates according to filters
  const filteredCandidates = candidates
    .filter(candidate => statusFilter === 'All' || candidate.status === statusFilter)
    .filter(candidate => positionFilter === 'All' || candidate.position === positionFilter)
    .filter(candidate =>
      candidate.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      {/* Feedback Toast */}
      {feedback.show && (
        <div style={{
          position: 'fixed',
          top: isMobile ? 10 : 20,
          right: isMobile ? 10 : 20,
          left: isMobile ? 10 : 'auto',
          padding: isMobile ? '10px 16px' : '12px 24px',
          borderRadius: 8,
          color: '#fff',
          background: feedback.type === 'error' ? '#f44336' : feedback.type === 'info' ? '#2196f3' : '#4caf50',
          zIndex: 1001,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.3s ease',
          fontSize: isMobile ? '13px' : '14px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          {feedback.message}
        </div>
      )}

      <Header title="Candidates" />

      <div className="menubar">
        <div className="menubar-left">
          {/* New Dropdown */}
          <div className="dropdown-container" style={{ position: 'relative' }}>
            <button
              className="dropdown-btn"
              onClick={() => setNewDropdownOpen(!newDropdownOpen)}
            >
              {isMobile ? 'Status' : 'New'}
              <FiChevronDown size={isMobile ? 12 : 14} />
            </button>
            {newDropdownOpen && (
              <div className="dropdown-menu">
                {statusOptions.map(option => (
                  <div
                    key={option}
                    className="dropdown-item"
                    onClick={() => {
                      setStatusFilter(option);
                      setNewDropdownOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Position Dropdown */}
          <div className="dropdown-container" style={{ position: 'relative' }}>
            <button
              className="dropdown-btn"
              onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
            >
              Position
              <FiChevronDown size={isMobile ? 12 : 14} />
            </button>
            {positionDropdownOpen && (
              <div className="dropdown-menu">
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
        </div>

        <div className="menubar-right">
          {/* Search */}
          <input
            type="text"
            placeholder={isMobile ? "Search candidates..." : "Search"}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {/* Add Candidate Button */}
          <button
            onClick={() => setFormOpen(true)}
            className="add-btn"
          >
            <span style={{ fontSize: isMobile ? '16px' : '18px' }}>+</span>
            {isMobile ? 'Add' : 'Add Candidate'}
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div style={{
          display: 'flex',
          gap: 8,
          margin: '0 32px 16px 32px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {statusFilter !== 'All' && (
            <span className="filter-tag">
              Status: {statusFilter}
              <button
                onClick={() => setStatusFilter('All')}
                aria-label="Remove status filter"
              >
                ×
              </button>
            </span>
          )}
          {positionFilter !== 'All' && (
            <span className="filter-tag position">
              Position: {positionFilter}
              <button
                onClick={() => setPositionFilter('All')}
                aria-label="Remove position filter"
              >
                ×
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="filter-tag">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#666',
              fontFamily: 'Nunito'
            }}
          >
            Clear All
          </button>
        </div>
      )}

      <div className="candidates-table-container">
        <CandidatesTable
          candidates={filteredCandidates}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onStatusChange={handleStatusChange}
          onRefresh={refreshCandidates}
        />
      </div>

      <CandidateForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleCandidateSave}
      />
    </div>
  );
};

export default Candidates;
