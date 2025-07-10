import React, { useState } from 'react';
import { FiChevronDown, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import './LeavesTable.css';

const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

const LeavesTable = ({ leaves, onStatusChange, onDelete, statusFilter, setStatusFilter, searchTerm, setSearchTerm }) => {
  const [rowStatusDropdown, setRowStatusDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  // Filter leaves
  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = statusFilter === 'All' || leave.status === statusFilter;
    const matchesSearch =
      leave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.leave-action-menu-container')) {
        setMenuOpen(null);
      }
      if (!event.target.closest('.leave-row-status-dropdown')) {
        setRowStatusDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="leaves-table-container">
           <table className="leaves-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Docs</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map(leave => (
            <tr key={leave.id}>
              <td><img src={leave.profile} alt={leave.name} className="leaves-profile-img" /></td>
              <td>
                {leave.name}
                <div className="leaves-designation">{leave.designation}</div>
              </td>
              <td>{leave.date}</td>
              <td>{leave.reason}</td>
              <td style={{ position: 'relative' }}>
                <div className="leave-row-status-dropdown" style={{ display: 'inline-block' }}>
                  <button
                    className={`leaves-status-btn ${leave.status.toLowerCase()}`}
                    onClick={() => setRowStatusDropdown(rowStatusDropdown === leave.id ? null : leave.id)}
                  >
                    {leave.status}
                    <FiChevronDown size={14} style={{ marginLeft: 8 }} />
                  </button>
                  {rowStatusDropdown === leave.id && (
                    <div className="dropdown-menu">
                      {statusOptions.filter(opt => opt !== 'All').map(option => (
                        <div
                          key={option}
                          className="dropdown-item"
                          onClick={() => {
                            onStatusChange(leave.id, option);
                            setRowStatusDropdown(null);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td>{leave.docs ? <a href={leave.docs} target="_blank" rel="noopener noreferrer">📄</a> : '-'}</td>
              <td style={{ position: 'relative', textAlign: 'center' }}>
                <div className="leave-action-menu-container">
                  <button
                    className="action-menu-btn"
                    onClick={() => setMenuOpen(menuOpen === leave.id ? null : leave.id)}
                  >
                    <FiMoreVertical size={16} />
                  </button>
                  {menuOpen === leave.id && (
                    <div className="leave-action-menu">
                      <div
                        className="leave-action-menu-item delete"
                        onClick={() => {
                          onDelete(leave.id);
                          setMenuOpen(null);
                        }}
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
    </div>
  );
};

export default LeavesTable; 