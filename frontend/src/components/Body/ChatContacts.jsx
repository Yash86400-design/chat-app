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
  const [secondPerson, setSecondPerson] = useState([]);

  useEffect(() => {
    const fetchChattingWithData = async () => {
      if (userProfile?.joinedChats.length !== 0) {
        const personalChats = userProfile?.joinedChats;
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

  return (
    <div className="chatListContainer">
      {secondPerson?.map((data, index) => (
        <ChattingWith key={index} id={data?.id} name={data?.name} avatar={data?.avatar} bio={data?.bio} type={data?.type} socketId={data?.socketRoomId} socket={socket} firstPerson={userProfile?.name} />
      ))}
    </div>

  );
}

export default ChatContacts;

