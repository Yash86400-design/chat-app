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
  // const [chatName, setChatName] = useState('');
  // const [chatAvatar, setChatAvatar] = useState('');

  return (
    // <ChatIdContext.Provider value={{ chatId, setChatId, chatName, setChatName, chatAvatar, setChatAvatar }}>
    <ChatIdContext.Provider value={{ chatUserInfo, setChatUserInfo }}>
      {children}
    </ChatIdContext.Provider>
  );
};

export default ChatIdContext;