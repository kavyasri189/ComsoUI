import React, { useState, useEffect } from 'react';
import '../styles/ChatComponent.css'; // Adjust the import path
import RexIconAvatar from '../assets/images/RexIconAvatar.jpg';

const ChatComponent = ({ setShowChat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Load chat history from localStorage when the component mounts
  useEffect(() => {
    const savedSession = localStorage.getItem('chatSession');
    if (savedSession) {
      setMessages(JSON.parse(savedSession));
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatSession', JSON.stringify(messages));
    }
  }, [messages]);

  const fetchChatResponse = async (input) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`, // replace with your actual API key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: input }],
        }),
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'Error: Unable to fetch response.';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInput(''); // Clear input field immediately

    const aiResponse = await fetchChatResponse(input);
    const aiMessage = { role: 'assistant', content: aiResponse };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  };

  const handleEndChat = () => {
    setMessages([]);
    localStorage.removeItem('chatSession');
    setShowChat(false); // Return to landing page
  };

  return (
    <div className="chat-container-2">
      <img src={RexIconAvatar} alt="Icon" className="icon-img" />
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}>
            {message.content}
          </div>
        ))}
      </div>
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      <button className="end-chat-button" onClick={handleEndChat}>End Chat</button>
    </div>
  );
};

export default ChatComponent;
