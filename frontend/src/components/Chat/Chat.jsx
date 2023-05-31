import React, { useContext } from 'react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import ChatIdContext from '../../context/ChatIdContext';

function Chat() {
  const { chatId } = useContext(ChatIdContext);
  console.log(chatId);
  // const chatId = useContext(ChatContext);
  // console.log(chatId);

  return (
    <div>
      <ChatHeader />
      <ChatBody />
      <ChatInput />
    </div>
  );
}

export default Chat;