import React, { useContext } from 'react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import ChatIdContext from '../../context/ChatIdContext';

function Chat() {
  const { chatUserInfo } = useContext(ChatIdContext);
  const { name, id, avatar, bio } = chatUserInfo;
  // const chatId = useContext(ChatContext);
  // console.log(chatId);

  return (
    <div>
      <ChatHeader userId={id} userName={name} userAvatar={avatar} userBio={bio} />
      <ChatBody userId={id} />
      <ChatInput userId={id} />
    </div>
  );
}

export default Chat;