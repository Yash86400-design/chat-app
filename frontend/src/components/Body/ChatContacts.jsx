import React, { useEffect, useState } from 'react';
import './chatContacts.css';
import ChattingWith from './ChattingWith';
import { useSelector } from 'react-redux';
// import userService from '../../services/userService';

function ChatContacts({ socket }) {
  const { userProfile } = useSelector((state) => state.userProfile);
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
      if (userProfile?.joinedChats !== null) {
        const personalChats = userProfile?.joinedChats;

        // const promises = personalChats.map(element =>
        //   userService.userInfo(element)
        // );

        // const data = await Promise.all(promises);
        // const data = personalChats.map((user) => )

        setSecondPerson(personalChats);
      }
    };

    fetchChattingWithData();
    return () => {
      setSecondPerson([]);
    };
  }, [userProfile]);

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

