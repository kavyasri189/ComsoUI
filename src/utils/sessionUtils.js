// src/utils/sessionUtils.js

export const saveChatSession = (messages) => {
    localStorage.setItem('chatSession', JSON.stringify(messages));
  };
  
  export const loadChatSession = () => {
    const session = localStorage.getItem('chatSession');
    return session ? JSON.parse(session) : [];
  };
  
  export const clearChatSession = () => {
    localStorage.removeItem('chatSession');
  };
  