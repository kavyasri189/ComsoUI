import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { fetchUserActivityData } from '../api'; // Mock function to fetch data
import '../styles/ActivityDashboard.css';

// Register Chart.js components
ChartJS.register(...registerables);

const ActivityDashboard = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [messagesSent, setMessagesSent] = useState([]);
  const [userEngagement, setUserEngagement] = useState([]);
  
  // Step 1: State variables for time frame selection
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserActivityData();
      setActiveUsers(data.activeUsers);
      setMessagesSent(data.messagesSent);
      setUserEngagement(data.userEngagement);
    };

    fetchData();
  }, []);

  // Step 1: UI for date selection (example implementation)
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  // Step 3: Data filtering function
  const filterChartData = (data, startDate, endDate) => {
    // Implement logic to filter data based on startDate and endDate
    // Example:
    // return data.filter(item => item.date >= startDate && item.date <= endDate);
    return data; // Placeholder return
  };

  const activeUsersData = {
    labels: activeUsers.map(data => data.date),
    datasets: [
      {
        label: 'Active Users',
        data: filterChartData(activeUsers, startDate, endDate).map(data => data.count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const messagesSentData = {
    labels: messagesSent.map(data => data.date),
    datasets: [
      {
        label: 'Messages Sent',
        data: filterChartData(messagesSent, startDate, endDate).map(data => data.count),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const userEngagementData = {
    labels: userEngagement.map(data => data.activity),
    datasets: [
      {
        label: 'User Engagement',
        data: userEngagement.map(data => data.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="activity-dashboard">
      <h1>Activity Dashboard</h1>
      
      {/* Step 1: Date selection UI (example) */}
      <div className="date-selection" >
        <label className="component-a">Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={handleDateChange}
        />

        <label className="component-b">End Date:</label>
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Existing chart components */}
      <div className="chart-container component">
        <h2>Active Users</h2>
        <Line data={activeUsersData} className="component"/>
      </div>
      <div className="chart-container component">
        <h2>Messages Sent</h2>
        <Bar data={messagesSentData} className="component"/>
      </div>
      <div className="chart-container component">
        <h2>User Engagement</h2>
        <Doughnut data={userEngagementData} className="component" />
      </div>
    </div>
  );
};

export default ActivityDashboard;
