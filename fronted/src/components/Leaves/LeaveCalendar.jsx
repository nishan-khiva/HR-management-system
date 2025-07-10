import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './LeaveCalendar.css'; // custom styles (below)

const LeaveCalendar = () => {
  const [value, setValue] = useState(new Date());

  return (
    <div className="leave-calendar-container">
      <div
        style={{
          background: '#4B1979',
          color: '#fff',
          borderRadius: '8px 8px 0 0',
          padding: 12,
          fontWeight: 600,
        }}
      >
        Leave Calendar
      </div>
      <div style={{ padding: 16, minHeight: 200, textAlign: 'center' }}>
        <Calendar onChange={setValue} value={value} />
      </div>
    </div>
  );
};

export default LeaveCalendar;
