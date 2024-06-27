import React from 'react';
import '../styles/LandingPage.css'; // Ensure the CSS file is imported
import RexIconAvatar from '../assets/images/RexIconAvatar.jpg';
const LandingPage = ({ onStartChat }) => {
  return (
    
    <div className="landing-page">
      <div className="overlay">
        <div className="content">
        <img src={RexIconAvatar} alt="Icon" className="icon-img" />
          <h1>Rex Chat App</h1>
          <button className="start-chat-button" onClick={onStartChat}>
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
