import React from 'react';
import './chatContacts.css';
import ChattingWith from '../RealChat/ChattingWith';
import { useSelector } from 'react-redux';

function ChatContacts() {
  const { userProfile } = useSelector((state) => state.userProfile);

  // console.log(userProfile.joinedChatrooms, userProfile.joinedPersonalChats);
  // console.log(userProfile);

  return (
    <div className='allChats'>
      <ChattingWith name={'Harsh Pandey'} message={'Miss you...'} />
      <ChattingWith name={'Pravin More'} message={"I'll catch you very soon..."} />
      <ChattingWith name={'Vishal Gautam'} message={'How you doin???'} />
    </div>
  );
}

export default ChatContacts;