
import React, { useState, useEffect } from 'react';
import '../styles/Chat.css';
import RexIconAvatar from '../assets/images/RexIconAvatar.jpg';
import { db } from '../notifications/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const Chat = ({ setShowChat, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const logUserActivity = async () => {
      await addDoc(collection(db, 'userActivity'), {
        userId: userId,
        timestamp: serverTimestamp(),
        type: 'login',
      });
    };

    logUserActivity();
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'chatMessages'));
        const fetchedMessages = snapshot.docs.map(doc => doc.data());
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const saveMessage = async () => {
        try {
          const newMessage = messages[messages.length - 1];
          await addDoc(collection(db, 'chatMessages'), newMessage);
          await addDoc(collection(db, 'messageStats'), {
            userId: userId,
            timestamp: serverTimestamp(),
            message: newMessage.content,
          });
        } catch (error) {
          console.error('Error saving message:', error);
        }
      };

      saveMessage();
    }
  }, [messages, userId]);

  const fetchChatResponse = async (input) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer `, // use environment variable
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

  const handleEndChat = async () => {
    setMessages([]);
    try {
      const snapshot = await getDocs(collection(db, 'chatMessages'));
      snapshot.forEach((docSnapshot) => {
        deleteDoc(doc(db, 'chatMessages', docSnapshot.id));
      });
    } catch (error) {
      console.error('Error ending chat:', error);
    }
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

export default Chat;

