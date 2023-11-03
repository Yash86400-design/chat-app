import { useContext, useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import ChatIdContext from '../../context/ChatIdContext';
import './chat.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function Chat({ socket, pageWidth }) {
  const { chatUserInfo } = useContext(ChatIdContext);
  const { name, id, avatar, bio, type, socketId } = chatUserInfo;
  // const { userToken } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.userProfile);
  const [isKnown, setIsKnown] = useState(false);

  const clearWaitingQueue = () => {
    toast.clearWaitingQueue();
  };

  useEffect(() => {
    const isKnown = userProfile?.joinedChats.some((user) => user.id === id);
    setIsKnown(isKnown);
  }, [userProfile?.joinedChats, id]);

  // useEffect(() => {
  //   if (isKnown === true && type === 'Chatroom') {
  //     toast.info(`Welcome to the ${name} chatroom. Please note that only admins are authorized to take actions on notifications. 🙏`);
  //   }
  // }, [type, isKnown, name]);

  clearWaitingQueue();

  return (
    <>
      {
        /* Userprofile check is needed cause sometimes other things loads faster so we need to show the data only when userProfile is available...*/
        name && userProfile && (
          <div className={`chatRoomPage ${chatUserInfo.id === '' ? 'notSelectedAnyRoom' : 'selectedRoom'}`}>
            <ChatHeader userId={id} userName={name} userAvatar={avatar} userBio={bio} userType={type} socketId={socketId} isKnown={isKnown} socketInstance={socket} />
            <ChatBody userId={id} userType={type} isKnown={isKnown} socketId={socketId} socketInstance={socket} pageWidth={pageWidth} />
            <ChatInput userId={id} userType={type} isKnown={isKnown} socketId={socketId} socketInstance={socket} />
          </div>
        )
      }

      {
        !name && userProfile && (
          <div className="emptyPage">
            <p>No Chat Selected</p>
          </div>
        )
      }
    </>
  );
}

export default Chat;