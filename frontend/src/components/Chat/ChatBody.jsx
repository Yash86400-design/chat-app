import React, { useEffect, useRef, useState } from 'react';
import './chatBody.css';
import { useDispatch, useSelector } from 'react-redux';
// import Spinner from '../Spinner/Spinner';
import { fetchChatroomMessages, fetchUserMessages } from '../../features/userSlice';
import ChatFetchingSpinner from '../Spinner/ChatFetchingSpinner';
// import socketIOClient from 'socket.io-client';

function ChatBody({ isKnown, userType, userId, socket }) {
  const [message, setMessage] = useState([]);
  const { userProfile, fetchingMessageLoading } = useSelector((state) => state.userProfile);
  // const socket = socketIOClient('http://localhost:5000');
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();

  // console.log('Socket connected:', socket.connected);

  // if (isKnown) {
  //   if (userType === 'User') {
  //     let allMessage = await userService.fetchUserMessages();
  //   } else {

  //   }
  // }

  useEffect(() => {
    const fetchMessages = async () => {
      if (isKnown && userType === 'User') {
        const storedMessages = localStorage.getItem('messages');
        const parsedMessages = storedMessages ? JSON.parse(storedMessages) : null;
        if (parsedMessages && parsedMessages[userId]) {
          setMessage(parsedMessages[userId]);
        } else {
          const allMessages = await dispatch(fetchUserMessages(userId));
          setMessage(allMessages.payload);
        }
      } else if (isKnown && userType === 'Chatroom') {
        const storedMessages = localStorage.getItem('messages');
        const parsedMessages = storedMessages ? JSON.parse(storedMessages) : null;

        if (parsedMessages && parsedMessages[userId]) {
          setMessage(parsedMessages[userId]);
        } else {
          const allMessages = await dispatch(fetchChatroomMessages(userId));
          setMessage(allMessages.payload);
        }
      }
    };

    fetchMessages();

    return () => {
      setMessage([]);
    };
  }, [isKnown, userType, userId, dispatch]);

  useEffect(() => {
    // const handleNewMessage = (newMessage) => {
    //   // console.log(newMessage);
    //   setMessage((prevMessages) => {
    //     const updatedMessages = [...prevMessages, newMessage];

    //     // Update the localStorage with the new message
    //     const storedMessages = localStorage.getItem('messages');
    //     const parsedMessages = storedMessages ? JSON.parse(storedMessages) : {};

    //     // Check if the message belongs to a user or chatroom
    //     const chatId = userType === 'User' ? userId : userId; // Modify this condition if needed

    //     // Update the messages for the specific user/chatroom
    //     parsedMessages[chatId] = updatedMessages;

    //     // Save the updated messages in localStorage
    //     localStorage.setItem('messages', JSON.stringify(parsedMessages));

    //     return updatedMessages;
    //   });
    // };
    const handleNewPersonalMessage = (newMessage) => {
      console.log(newMessage);

    };

    const handleNewChatroomMessage = (newMessage) => {
      console.log(newMessage);
    };

    // Listen for newMessage event from the server
    socket.on('newPersonalMessage', handleNewPersonalMessage);
    socket.on('newChatroomMessage', handleNewChatroomMessage);
    // socket.on('', handleNewMessage);


    socket.on('newMessage', (message) => {
      console.log(`New Message: ${message.content}`);
    });


    return () => {
      // Clean up the event listener when the component unmounts
      // socket.off('newMessage', handleNewMessage);
      socket.off('newPersonalMessage', handleNewPersonalMessage);
      socket.off('newChatroomMessage', handleNewChatroomMessage);
    };
    // }, [socket, userId, userType]);
  }, [socket]);
  // useEffect(() => {
  //   const chatContainer = chatContainerRef.current;
  //   if (chatContainer) {
  //     console.log(chatContainer);
  //   }
  // }, []);

  // useEffect(() => {
  //   const chatContainer = chatContainerRef.current;
  //   if (chatContainer) {
  //     console.log(chatContainer);
  //   }
  // }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [message]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    return () => {
      if (chatContainer) {
        chatContainer.scrollTop = 0;
      }
    };
  }, []);

  // console.log(socket);

  // if (fetchingMessageLoading) {
  //   return <Spinner />;
  // }

  // if (fetchingMessageLoading) {
  //   console.log(`FetchLoading is True. Messages: ${message}`);
  // } else {
  //   console.log(`FetchLoading is False.Messages: ${message}`);
  // }
  // console.log(chatContainerRef.current);
  // if (fetchingMessageLoading) {
  //   return <Spinner />;
  // }
  return (
    <>
      {
        fetchingMessageLoading ? (
          <ChatFetchingSpinner />
        ) :
          (
            <div className='chatBodySection'>
              {
                isKnown && message.length !== 0 && userType === 'Chatroom' && (
                  <div className='chatBody' ref={chatContainerRef}>
                    {Array.isArray(message) && message.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.sender === userProfile._id ? 'left' : 'right'}`}
                      >
                        <p>{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )
              }

              {
                isKnown && message.length !== 0 && userType === 'User' && (
                  <div className='chatBody' ref={chatContainerRef}>
                    {Array.isArray(message) && message.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.sender === userProfile._id ? 'left' : 'right'}`}
                      >
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
            </div>
          )
      }
    </>
  );
}

export default ChatBody;

