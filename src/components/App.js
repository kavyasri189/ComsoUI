
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import Login from './Login';
import ChatComponent from './Chat';
import ActivityDashboard from './ActivityDashboard';
import '../styles/App.css';
import { generateToken, messaging } from '../notifications/firebase';
import { onMessage } from 'firebase/messaging';

function App() {
  const [userId] = useState(uuidv4()); // Generate unique user ID

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
  }, []);

  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            exact
            path="/"
            element={
              !showChat ? (
                <Login onStartChat={handleStartChat} />
              ) : (
                <ChatComponent setShowChat={setShowChat} userId={userId} />
              )
            }
          />
          <Route path="/dashboard" element={<ActivityDashboard userId={userId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

