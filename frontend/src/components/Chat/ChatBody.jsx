import React, { useEffect, useRef, useState } from 'react';
import './chatBody.css';
import userService from '../../services/userService';
import { useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';

function ChatBody({ isKnown, userType, userId }) {
  const [message, setMessage] = useState([]);
  const { userProfile } = useSelector((state) => state.userProfile);
  const socket = socketIOClient('http://localhost:5000');
  const chatContainerRef = useRef(null);

  // if (isKnown) {
  //   if (userType === 'User') {
  //     let allMessage = await userService.fetchUserMessages();
  //   } else {

  //   }
  // }

  useEffect(() => {
    const fetchMessages = async () => {
      if (isKnown && userType === 'User') {
        const allMessages = await userService.fetchUserMessages(userId);
        setMessage(allMessages);
      } else if (isKnown && userType === 'Chatroom') {
        const allMessages = await userService.fetchGroupMessages(userId);
        console.log(allMessages);
        setMessage(allMessages);
      }
    };

    fetchMessages();

    const handleNewMessage = (newMessage) => {
      setMessage((prevMessages) => [...prevMessages, newMessage]);
    };

    // Listen for newMessage event from the server
    socket.on('newMessage', handleNewMessage);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off('newMessage', handleNewMessage);
    };
  }, [isKnown, userType, userId, socket]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [message]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = 0;
  }, []);

  return (
    <>
      {
        isKnown && (message.length !== 0) && (userType === 'Chatroom') && (
          <div className='chatBody' ref={chatContainerRef}>
            {message.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender._id === userProfile._id ? 'left' : 'right'}`}
              >
                {/* <p>Sender:{msg.sender}</p>
                <p>Reciever: {msg.receiver}</p> */}
                {/* <p>Content: {msg.content}</p> */}
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        )
      }
      {
        isKnown && (message.length !== 0) && (userType === 'User') && (
          <div className='chatBody'>
            {message.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === userProfile._id ? 'left' : 'right'}`}
              >
                {/* <p>Sender:{msg.sender}</p>
                <p>Reciever: {msg.receiver}</p> */}
                {/* <p>Content: {msg.content}</p> */}
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        )
      }
      {
        isKnown && (message.length === 0) && (
          <div className='chatBodyNoMessage'>
            <p>No Conversation Found, Start a new conversation...</p>
          </div>
        )
      }

      {
        !isKnown && (
          <div className='chatBodyUnKnown'>
            <p>Not Allowed</p>
          </div>
        )
      }

    </>
  );
}

export default ChatBody;