import { useContext, useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import ChatIdContext from '../../context/ChatIdContext';
import './chat.css';
import { useSelector } from 'react-redux';
// import createSocketInstance from '../../socket/socket';
// import socketIOClient from 'socket.io-client';

// function Chat({ socket }) {
function Chat({ socket }) {
  const { chatUserInfo } = useContext(ChatIdContext);
  const { name, id, avatar, bio, type, socketId } = chatUserInfo;
  console.log(avatar);
  // const { userToken } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.userProfile);
  const [isKnown, setIsKnown] = useState(false);

  // const socket = socketIOClient('http://localhost:5000', {
  //   query: { token: userToken }
  // });

  // const socket = createSocketInstance(userToken);

  // const allChats = userProfile.joinedPersonalChats.concat(userProfile.joinedChatrooms);
  // const isFriend = userProfile?.joinedPersonalChats.includes(id);
  // const isChatroomMember = userProfile?.joinedChatrooms.includes(id);

  // let isKnown = false;
  // if (isFriend || isChatroomMember) {
  //   isKnown = true;
  // }

  useEffect(() => {
    // userProfile.joinedChats.map((user) => {
    //   if (user.id === id) {
    //     setIsKnown(true);
    //   }
    //   else {
    //     setIsKnown(false);
    //   }
    //   return null;
    // });
    const isKnown = userProfile?.joinedChats.some((user) => user.id === id);
    setIsKnown(isKnown);
  }, [userProfile, id]);

  /* useState sucks here in first render of page
  // const chatId = useContext(ChatContext);
  // console.log(chatId);

  // if (name === '') {
  //   console.log('Hello');
  //   setCurrentPageState(true);
  // } else {
  //   console.log('Devanand');
  //   setCurrentPageState(false);
  // }

  // // if (!name && !id && !avatar && !bio && !type) {
  // //   console.log('Hi');
  // // }
  // // if (name || id || avatar || bio || type) {
  // if (name !== '') {
  // }
  */
  return (
    <>
      {
        /* Userprofile check is needed cause sometimes other things loads faster so we need to show the data only when userProfile is available...*/
        name && userProfile && (
          <div>
            {/* <ChatHeader userId={id} userName={name} userAvatar={avatar} userBio={bio} userType={type} isFriend={isFriend} isChatroomMember={isChatroomMember} /> */}
            <ChatHeader userId={id} userName={name} userAvatar={avatar} userBio={bio} userType={type} socketId={socketId} isKnown={isKnown} socketInstance={socket} />
            <ChatBody userId={id} userType={type} isKnown={isKnown} socketId={socketId} socketInstance={socket} />
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