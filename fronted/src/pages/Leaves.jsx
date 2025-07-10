import React, { useState, useEffect } from 'react';
import LeavesTable from '../components/Leaves/LeavesTable';
import LeaveCalendar from '../components/Leaves/LeaveCalendar';
import AddLeaveModel from '../components/Leaves/AddLeaveModel';
import api from '../Api/axiosInstance';
import '../components/Leaves/LeavesTable.css';
import '../components/Leaves/LeaveCalendar.css';
import '../components/Leaves/AddLeaveModel.css';
import { FiSearch, FiPlus } from 'react-icons/fi';
import styles from './Leaves.module.css';

const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/leaves/');
        // Map backend data to table format
        const mapped = res.data.map((leave) => ({
          id: leave._id,
          profile: '', // No profile in backend, can be set if available
          name: leave.employee?.fullname || leave.employee?.fullname || 'N/A',
          designation: leave.designation || leave.employee?.designation || '',
          date: leave.leaveDate ? new Date(leave.leaveDate).toLocaleDateString() : '',
          reason: leave.reason,
          status: leave.status,
          docs: leave.document || '',
        }));
        setLeaves(mapped);
      } catch (err) {
        setError('Failed to fetch leaves.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  // Handlers
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update status in backend
      await api.patch(`/api/leaves/status/${id}`, { status: newStatus });
      
      // Update local state
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === id ? { ...leave, status: newStatus } : leave
        )
      );
    } catch (error) {
      console.error('Error updating leave status:', error);
      // You might want to show an error message to the user here
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave?')) {
      try {
        await api.delete(`/api/leaves/${id}`);
        
        // Update local state
        setLeaves((prev) => prev.filter((leave) => leave.id !== id));
      } catch (error) {
        console.error('Error deleting leave:', error);
      }
    }
  };
  const refreshLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/leaves/');
      // Map backend data to table format
      const mapped = res.data.map((leave) => ({
        id: leave._id,
        profile: '', // No profile in backend, can be set if available
        name: leave.employee?.fullname || leave.employee?.fullname || 'N/A',
        designation: leave.designation || leave.employee?.designation || '',
        date: leave.leaveDate ? new Date(leave.leaveDate).toLocaleDateString() : '',
        reason: leave.reason,
        status: leave.status,
        docs: leave.document || '',
      }));
      setLeaves(mapped);
    } catch (err) {
      setError('Failed to fetch leaves.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeave = async (leave) => {
    // Refresh the leaves list to get the latest data
    await refreshLeaves();
  };

  // Approved leaves for right panel
  const approvedLeaves = leaves.filter((l) => l.status === 'Approved');

  return (
    <div className={styles.leavesPageRoot}>
      <div className={styles.leavesSectionTitle}>Leaves</div>
      {/* Top Bar */}
      <div className={styles.leavesTopBar}>
        {/* Status Filter */}
        <select
          className="dropdown-btn"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ minWidth: 120 }}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div style={{ flex: 1 }} />
        <div className={styles.leavesTopBarRight}>
          <div className={styles.leavesSearchBar}>
            <input
              className={styles.leavesSearchInput}
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className={styles.leavesSearchIcon} size={18} />
          </div>
          <button
            className="addleave-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#4B1979', color: '#fff', fontWeight: 600, fontSize: 16, padding: '10px 24px', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            onClick={() => setAddModalOpen(true)}
          >
            <FiPlus /> Add Leave
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className={styles.leavesMainContent}>
        {/* Left: Leaves Table */}
        <div className={styles.leavesTableCard}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: 32, color: 'red', textAlign: 'center' }}>{error}</div>
          ) : (
            <LeavesTable
              leaves={leaves}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
        </div>
        {/* Right: Calendar + Approved Leaves */}
        <div className={styles.leavesRightPanel}>
          <div className={styles.leavesCalendarCard}>
            <LeaveCalendar />
          </div>
          <div className={styles.leavesApprovedCard}>
            <div style={{ color: '#4B1979', fontWeight: 600, marginBottom: 8 }}>Approved Leaves</div>
            {approvedLeaves.length === 0 ? (
              <div style={{ color: '#888', fontSize: 14 }}>No approved leaves.</div>
            ) : (
              approvedLeaves.map((leave) => (
                <div key={leave.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src={leave.profile} alt={leave.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{leave.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{leave.designation}</div>
                  </div>
                  <div style={{ fontSize: 13, color: '#4B1979', fontWeight: 600 }}>{leave.date}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Add Leave Modal */}
      <AddLeaveModel open={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleAddLeave} />
    </div>
  );
};

export default Leaves;
