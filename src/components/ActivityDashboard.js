
import React, { useEffect, useState } from 'react';
import { db } from '../notifications/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart as ChartJS, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale);

const ActivityDashboard = () => {
  const [userActivity, setUserActivity] = useState([]);
  const [messageStats, setMessageStats] = useState([]);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'userActivity'));
        const activityData = snapshot.docs.map(doc => doc.data()).sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        console.log('User Activity Data:', activityData);
        setUserActivity(activityData);
      } catch (error) {
        console.error('Error fetching user activity:', error);
      }
    };

    const fetchMessageStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'messageStats'));
        const messageData = snapshot.docs.map(doc => doc.data()).sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        console.log('Message Stats Data:', messageData);
        setMessageStats(messageData);
      } catch (error) {
        console.error('Error fetching message stats:', error);
      }
    };

    fetchUserActivity();
    fetchMessageStats();
  }, []);

  const aggregateDataBy30Minutes = (data) => {
    const aggregatedData = {};
    data.forEach(item => {
      const date = new Date(item.timestamp.seconds * 1000);
      const minutes = date.getMinutes() >= 30 ? 30 : 0;
      date.setMinutes(minutes, 0, 0);
      const key = date.toISOString();
      if (!aggregatedData[key]) {
        aggregatedData[key] = 0;
      }
      aggregatedData[key] += 1;
    });
    return aggregatedData;
  };

  const userActivityBy30Minutes = aggregateDataBy30Minutes(userActivity);
  const messageStatsBy30Minutes = aggregateDataBy30Minutes(messageStats);

  const userActivityData = {
    labels: Object.keys(userActivityBy30Minutes),
    datasets: [
      {
        label: 'User Logins',
        data: Object.values(userActivityBy30Minutes),
        backgroundColor: 'purple',
      },
    ],
  };

  const messageStatsData = {
    labels: Object.keys(messageStatsBy30Minutes),
    datasets: [
      {
        label: 'Messages Sent',
        data: Object.values(messageStatsBy30Minutes),
        backgroundColor: 'purple',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          stepSize: 30,
          displayFormats: {
            minute: 'MMM d, HH:mm',
          },
          tooltipFormat: 'MMM d, HH:mm',
        },
        ticks: {
          source: 'data',
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  };

  return (
    <div>
      <h2>User Activity</h2>
      <Bar data={userActivityData} options={options} />

      <h2>Message Statistics</h2>
      <Bar data={messageStatsData} options={options} />
    </div>
  );
};

export default ActivityDashboard;
