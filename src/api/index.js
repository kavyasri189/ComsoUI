// src/api/index.js
export const fetchUserActivityData = async () => {
  return {
    activeUsers: [
      { date: '2024-06-20', count: 5 },
      { date: '2024-06-22', count: 1},
      { date: '2024-06-24', count: 10 },
    ],
    messagesSent: [
      { date: '2024-06-20', count: 10 },
      { date: '2024-06-22', count: 5 },
      { date: '2024-06-24', count: 5 },
    ],
    userEngagement: [
      { activity: 'Login', count: 20 },
      { activity: 'Message Sent', count: 15 },
      { activity: 'Profile Update', count: 5},
    ],
  };
};
