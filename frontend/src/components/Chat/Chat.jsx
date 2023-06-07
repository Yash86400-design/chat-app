import { useContext } from 'react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import ChatIdContext from '../../context/ChatIdContext';
import './chat.css'


function Chat() {
  const { chatUserInfo } = useContext(ChatIdContext);
  const { name, id, avatar, bio, type } = chatUserInfo;
  
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
        name && (
          <div>
            <ChatHeader userId={id} userName={name} userAvatar={avatar} userBio={bio} userType={type} />
            <ChatBody userId={id} />
            <ChatInput userId={id} userType={type} />
          </div>
        )
      }

      {
        !name && (
          <div className="emptyPage">
            <p>No Chat Selected</p>
          </div>
        )
      }
    </>
  );
}

export default Chat;