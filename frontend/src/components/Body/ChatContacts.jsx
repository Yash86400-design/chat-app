import React, { useEffect, useState } from 'react';
import './chatContacts.css';
import ChattingWith from './ChattingWith';
import { useSelector } from 'react-redux';
import userService from '../../services/userService';

function ChatContacts() {
  const { userProfile } = useSelector((state) => state.userProfile);
  const [chattingWithUserData, setChattingWithUserData] = useState([]);
  const [groupChatData, setGroupChatData] = useState([]);

  // personalChats.forEach(element => {
  //   (userService.userInfo(element))
  //     .then((data) => {
  //       console.log(data);
  //     });
  // });

  // const handleUserClick = (event) => {
  //   console.log(event);
  // }

  // const handleGroupClick = (event) => {
  //   console.log(event);
  // }

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

  useEffect(() => {
    const fetchChattingWithData = async () => {
      const groupChats = userProfile.joinedChatrooms;

      const promises = groupChats.map(element =>
        userService.groupInfo(element)
      );

      const data = await Promise.all(promises);

      setGroupChatData(data);
    };

    fetchChattingWithData();
  }, [userProfile.joinedChatrooms]);

  // console.log(groupChatData[1]['_id']);

  return (
    <div className='allChats'>
      {/* <ChattingWith name={'Harsh Pandey'} message={'Miss you...'} />
      <ChattingWith name={'Pravin More'} message={"I'll catch you very soon..."} />
      <ChattingWith name={'Vishal Gautam'} message={'How you doin???'} /> */}
      {chattingWithUserData.map((data, index) => (
        <ChattingWith key={index} id={data._id} name={data.name} avatar={data.avatar} />
      ))}
      {groupChatData.map((data, index) => (
        <ChattingWith key={index} id={data._id} name={data.name} avatar={data.avatar} />
      ))}
    </div>
  );
}

export default ChatContacts;

