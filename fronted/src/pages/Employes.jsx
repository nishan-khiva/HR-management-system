import { useState, useEffect } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2, FiChevronDown, FiDownload } from 'react-icons/fi';
import '../components/Employees/Employees.css';
import Header from '../components/Header/Header';
import api from '../Api/axiosInstance';
import EmployeesTable from '../components/Employees/EmployeesTable';

const positionOptions = ['All', 'Designer', 'Developer', 'Human Resource', 'IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];

const Employes = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/api/employees/');
      let employeesArr = [];
      if (Array.isArray(response.data)) {
        employeesArr = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data.employees)) {
        employeesArr = response.data.data.employees;
      }
      if (employeesArr.length) {
        const employeesData = employeesArr.map(employee => ({
          id: employee._id,
          fullname: employee.fullname || employee.fullName || '',
          email: employee.email || '',
          phone: employee.phone || '',
          position: employee.position || '',
          department: employee.department || '-',
          doj: employee.doj ? new Date(employee.doj).toLocaleDateString() : '-',
          profile: 'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 50) + '.jpg',
          employeeId: employee.employeeId || '-',
          experience: employee.experience || 0,
          resume: employee.resume || null
        }));
        setEmployees(employeesData);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading employees...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ color: '#f44336', fontSize: '18px' }}>{error}</div>
        <button 
          onClick={fetchEmployees}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4B1979',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header title="Employees" count={employees.length} />
      <EmployeesTable employees={employees} fetchEmployees={fetchEmployees} />
    </div>
  );
};

export default Employes;
