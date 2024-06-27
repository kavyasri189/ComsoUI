import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './LandingPage';
import ChatComponent from './ChatComponent';
import ActivityDashboard from './ActivityDashboard'; // Import the new dashboard component
import '../styles/App.css';
import { generateToken, messaging } from '../notifications/firebase';
import { onMessage } from "firebase/messaging";

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
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
                <LandingPage onStartChat={handleStartChat} />
              ) : (
                <ChatComponent setShowChat={setShowChat} />
              )
            }
          />
          <Route path="/dashboard" element={<ActivityDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
