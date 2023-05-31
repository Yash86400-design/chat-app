import { createContext, useState } from 'react';

// Create the Context
const ChatIdContext = createContext();

// Create the AppProvider component
export const AppProvider = ({ children }) => {
  const [chatId, setChatId] = useState('');

  return (
    <ChatIdContext.Provider value={{ chatId, setChatId }}>
      {children}
    </ChatIdContext.Provider>
  );
};

export default ChatIdContext;