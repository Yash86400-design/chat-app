import React, { useContext, useEffect, useRef, useState } from 'react';
import './chatBody.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatroomMessages, fetchUserMessages } from '../../features/userSlice';
import ChatFetchingSpinner from '../Spinner/ChatFetchingSpinner';
import ChatIdContext from '../../context/ChatIdContext';
import { AiOutlineLeftCircle } from 'react-icons/ai';

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(
    'en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  );
}

function ChatBody({ isKnown, userType, userId, socketInstance, pageWidth }) {
  const [message, setMessage] = useState([]);
  const { userProfile, fetchingMessageLoading } = useSelector((state) => state.userProfile);
  const { chatUserInfo } = useContext(ChatIdContext);
  const { setChatUserInfo } = useContext(ChatIdContext);
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();

  const goBack = () => {
    setChatUserInfo({ id: '', name: '', avatar: '', bio: '', type: '', socketId: '' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const storedMessages = localStorage.getItem('messages');
      let parsedMessages = {};
      if (storedMessages) {
        parsedMessages = JSON.parse(storedMessages);
      }

      if (parsedMessages[userId]) {
        setMessage(parsedMessages[userId]);
      } else {
        let allMessages = [];
        if (isKnown && userType === 'User') {
          allMessages = await dispatch(fetchUserMessages(userId));
        } else if (isKnown && userType === 'Chatroom') {
          allMessages = await dispatch(fetchChatroomMessages(userId));
        }
        setMessage(allMessages.payload);

        // Store the messages in local storage
        parsedMessages[userId] = allMessages.payload;
        localStorage.setItem('messages', JSON.stringify(parsedMessages));
      }
    };

    fetchMessages();
  }, [isKnown, userType, userId, dispatch]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessage((prevMessages) => [
        ...prevMessages,
        {
          createdAt: newMessage.createdAt,
          content: newMessage.message,
          sender: newMessage.senderId,
          name: newMessage.name,
        },
      ]);

      // Update the messages in local storage
      const storedMessages = localStorage.getItem('messages');
      const parsedMessages = storedMessages ? JSON.parse(storedMessages) : {};
      const updatedMessages = {
        ...parsedMessages,
        [userId]: [
          ...(parsedMessages[userId] || []), // Get previous messages for the user if exists
          {
            createdAt: newMessage.createdAt,
            content: newMessage.message,
            sender: newMessage.senderId,
            name: newMessage.name,

          },
        ],
      };
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
    };

    // Listen for 'receiveMessage' event from the server and handle the new message
    socketInstance.on('receiveMessage', handleReceiveMessage);

    return () => {
      // Clean up the event listener when the component unmounts
      socketInstance.off('receiveMessage', handleReceiveMessage);
    };
  }, [socketInstance, userId]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [message]);

  return (
    <>
      {
        isKnown ? (
          fetchingMessageLoading ? (
            <ChatFetchingSpinner text='Fetching messages...' />
          ) : (
            <div className="chatBodySection">
              {isKnown && message?.length > 0 && (
                <div className="chatBody" ref={chatContainerRef}>
                  {pageWidth < 768 && !(chatUserInfo.id === '') && (
                    <div className="backButtonIcon">
                      <button onClick={() => goBack()}><AiOutlineLeftCircle size={32} /></button>
                    </div>
                  )}
                  {Array.isArray(message) &&
                    message.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.sender === userProfile._id ? 'right' : 'left'}`}
                      >
                        {userType === 'Chatroom' && (<h6 className='chatRoomChatUserName'>{msg.name}</h6>)}
                        <p>{msg.content}</p>
                        <strong><p className='messageTimestamp'>{formatTimestamp(msg.createdAt)}</p></strong>
                      </div>
                    ))}
                </div>
              )}
              {isKnown === true && message?.length === 0 && (
                <div className="chatBodyNoMessage">
                  <p>No Conversation Found, Start a new conversation...</p>
                  {pageWidth < 768 && (
                    <div className="backButtonIcon">
                      <button onClick={() => goBack()}><AiOutlineLeftCircle size={32} /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="chatBodyUnKnown">
            {pageWidth < 768 && !(chatUserInfo.id === '') && (
              <div className="backButtonIcon">
                <button onClick={() => goBack()}><AiOutlineLeftCircle size={32} /></button>
              </div>
            )}
            <p>Not Allowed</p>
          </div>
        )
      }
    </>
  );
}

export default ChatBody;

