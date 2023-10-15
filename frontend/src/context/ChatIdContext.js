import { createContext, useState } from 'react';

// Create the Context
const ChatIdContext = createContext();

// Create the AppProvider component
export const AppProvider = ({ children }) => {
  const [chatUserInfo, setChatUserInfo] = useState({
    id: '',
    name: '',
    avatar: '',
    bio: '',
    type: '',
    socketId: ''
  });

  return (
    <ChatIdContext.Provider value={{ chatUserInfo, setChatUserInfo }}>
      {children}
    </ChatIdContext.Provider>
  );
};

export default ChatIdContext;