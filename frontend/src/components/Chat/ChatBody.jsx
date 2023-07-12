import React, { useEffect, useRef, useState } from 'react';
import './chatBody.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatroomMessages, fetchUserMessages } from '../../features/userSlice';
import ChatFetchingSpinner from '../Spinner/ChatFetchingSpinner';

function ChatBody({ isKnown, userType, userId, socketInstance }) {
  const [message, setMessage] = useState([]);
  const { userProfile, fetchingMessageLoading } = useSelector((state) => state.userProfile);
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      // Fetch messages based on user type and ID
      if (isKnown && userType === 'User') {
        const allMessages = await dispatch(fetchUserMessages(userId));
        setMessage(allMessages.payload);
      } else if (isKnown && userType === 'Chatroom') {
        const allMessages = await dispatch(fetchChatroomMessages(userId));
        setMessage(allMessages.payload);
      }
    };

    fetchMessages();
  }, [isKnown, userType, userId, dispatch]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      // console.log(newMessage.senderId, userProfile._id);
      if (userType === 'Chatroom') {

        setMessage((prevMessages) => [...prevMessages, { createdAt: newMessage.createdAt, content: newMessage.message, sender: { _id: newMessage.senderId, name: newMessage.name } }]);
      } else if (userType === 'User') {
        setMessage((prevMessages) => [...prevMessages, { content: newMessage.message, sender: newMessage.senderId, createdAt: newMessage.createdAt }]);
      }
    };

    // Listen for 'receiveMessage' event from the server and handle the new message
    socketInstance.on('receiveMessage', handleReceiveMessage);

    return () => {
      // Clean up the event listener when the component unmounts
      socketInstance.off('receiveMessage', handleReceiveMessage);
    };
  }, [socketInstance, userType]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [message]);

  // Render the chat body based on the state
  return (
    <>
      {isKnown ? (
        fetchingMessageLoading ? (
          <ChatFetchingSpinner />
        ) : (
          <div className='chatBodySection'>
            {isKnown && message !== null && (
              <div className='chatBody' ref={chatContainerRef}>
                {Array.isArray(message) &&
                  message.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender === userProfile._id ? 'right' : 'left'}`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  ))}
              </div>
            )}
            {isKnown === true && message?.length === 0 && (
              <div className='chatBodyNoMessage'>
                <p>No Conversation Found, Start a new conversation...</p>
              </div>
            )}
          </div>
        )
      ) : (
        <div className='chatBodyUnKnown'>
          <p>Not Allowed</p>
        </div>
      )}
    </>
  );
}

export default ChatBody;
