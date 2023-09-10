import React, { useEffect, useState } from 'react';
import './chatContacts.css';
import ChattingWith from './ChattingWith';
import { useSelector } from 'react-redux';
import ChatFetchingSpinner from '../Spinner/ChatFetchingSpinner';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
// import userService from '../../services/userService';

function ChatContacts({ socket }) {

  const { userProfile, createChatroomLoading, createChatroomMessage } = useSelector((state) => state.userProfile);
  // const [chattingWithUserData, setChattingWithUserData] = useState([]);
  // const [groupChatData, setGroupChatData] = useState([]);
  const [secondPerson, setSecondPerson] = useState([]);
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


  // useEffect(() => {
  //   const fetchChattingWithData = async () => {
  //     if (userProfile.joinedPersonalChats !== null) {
  //       const personalChats = userProfile.joinedPersonalChats;

  //       const promises = personalChats.map(element =>
  //         userService.userInfo(element)
  //       );

  //       const data = await Promise.all(promises);

  //       setChattingWithUserData(data);
  //     }
  //     if (userProfile.joinedChatrooms !== null) {
  //       const groupChats = userProfile.joinedChatrooms;

  //       const promises = groupChats.map(element =>
  //         userService.groupInfo(element)
  //       );

  //       const data = await Promise.all(promises);

  //       setGroupChatData(data);
  //     };

  //   };

  //   fetchChattingWithData();

  //   return () => {
  //     setChattingWithUserData([]);
  //     setGroupChatData([]);
  //   };
  // }, [userProfile]);


  useEffect(() => {
    const fetchChattingWithData = async () => {
      // if (userProfile?.joinedChats !== null) {
      if (userProfile?.joinedChats.length !== 0) {
        const personalChats = userProfile?.joinedChats;

        // const promises = personalChats.map(element =>
        //   userService.userInfo(element)
        // );

        // const data = await Promise.all(promises);
        // const data = personalChats.map((user) => )

        setSecondPerson(personalChats);

        for (let chat = 0; chat < userProfile?.joinedChats.length; chat++) {
          if (userProfile?.joinedChats[chat].type === 'Chatroom') {
            const chatroomId = userProfile.joinedChats[chat].id;
            userService.fetchChatroomInfo({ id: chatroomId })
              .then((chatroomInfo) => {
                const storedChatroomInfo = JSON.parse(localStorage.getItem('chatroomInfo')) || {};
                storedChatroomInfo[chatroomId] = chatroomInfo;
                localStorage.setItem('chatroomInfo', JSON.stringify(storedChatroomInfo));
              })
              .catch((error) => {
                console.error('Error fetching chatroom info:', error);
              });
          }
        }
      }
    };

    fetchChattingWithData();
    return () => {
      setSecondPerson([]);
    };
  }, [userProfile]);

  if (createChatroomLoading) {
    return <ChatFetchingSpinner text='Creating...' />;
  }

  if (createChatroomMessage) {
    toast.error(createChatroomMessage);
  }


  // useEffect(() => {
  //   const fetchChattingWithData = async () => {

  //   };

  //   fetchChattingWithData();
  // }, [userProfile.joinedChatrooms]);

  // console.log(groupChatData[1]['_id']);
  return (
    <div className="chatListContainer">

      <div className='allChats'>
        {/* <ChattingWith name={'Harsh Pandey'} message={'Miss you...'} />
      <ChattingWith name={'Pravin More'} message={"I'll catch you very soon..."} />
      <ChattingWith name={'Vishal Gautam'} message={'How you doin???'} /> */}


        {/* {chattingWithUserData.map((data, index) => (
          <ChattingWith key={index} id={data?.id} name={data?.name} avatar={data?.avatar} bio={data?.bio} type={data?.type} />
        ))}
        {groupChatData.map((data, index) => (
          <ChattingWith key={index} id={data?._id} name={data?.name} avatar={data?.avatar} bio={data?.bio} type={data?.type} />
        ))} */}

        {secondPerson?.map((data, index) => (
          <ChattingWith key={index} id={data?.id} name={data?.name} avatar={data?.avatar} bio={data?.bio} type={data?.type} socketId={data?.socketRoomId} socket={socket} firstPerson={userProfile?.name} />
        ))}
      </div>
    </div>

  );
}

export default ChatContacts;

