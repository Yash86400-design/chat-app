import React, { useEffect, useState } from 'react';
import './chatContacts.css';
import ChattingWith from '../RealChat/ChattingWith';
import { useSelector } from 'react-redux';
import userService from '../../services/userService';

function ChatContacts() {
  const { userProfile } = useSelector((state) => state.userProfile);
  const [chattingWithUserData, setChattingWithUserData] = useState([]);

  const groupChats = userProfile.joinedChatrooms;

  // personalChats.forEach(element => {
  //   (userService.userInfo(element))
  //     .then((data) => {
  //       console.log(data);
  //     });
  // });

  const groupChatsInfo = () => {

  };

  useEffect(() => {
    const fetchChattingWithData = async () => {
      const personalChats = userProfile.joinedPersonalChats;

      const promises = personalChats.map(element =>
        userService.userInfo(element)
      );

      const data = await Promise.all(promises);

      setChattingWithUserData(data);
    };

    fetchChattingWithData();
  }, [userProfile.joinedPersonalChats]);

  return (
    <div className='allChats'>
      {/* <ChattingWith name={'Harsh Pandey'} message={'Miss you...'} />
      <ChattingWith name={'Pravin More'} message={"I'll catch you very soon..."} />
      <ChattingWith name={'Vishal Gautam'} message={'How you doin???'} /> */}
      {chattingWithUserData.map((data, index) => (
        <ChattingWith key={index} name={data.name} avatar={data.avatar} />
      ))}
    </div>
  );
}

export default ChatContacts;

