import React, { createContext, useContext, useEffect } from 'react';
import './chattingWith.css';
import ChatIdContext from '../../context/ChatIdContext';

// Create the ChatContext
const ChatContext = createContext();

function ChattingWith({ id, name, avatar, bio, type }) {
  const noProfileAvatar = 'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';
  const { setChatUserInfo } = useContext(ChatIdContext);
  // const { setChatId } = useContext(ChatContext);
  // const [chatId, setChatId] = useState('');
  const handleClick = (event) => {
    // const id = event.target.dataset.id;
    // const name = event.target.dataset.name;
    // const avatar = event.target.dataset.avatar;
    // const bio = event.target.dataset.bio;
    setChatUserInfo({ id, name, avatar, bio, type });
  };

  // Cleanup Context Value Once The Component Unmounts
  useEffect(() => {
    return () => {
      // Clean up the chatUserInfo when the component unmounts
      setChatUserInfo({
        id: '',
        name: '',
        avatar: '',
        bio: '',
        type: ''
      });
    };
  }, [setChatUserInfo]);  // Empty dependency array ensures the clean-up function is only called on unmount

  return (
    <div className='chatInfo' onClick={handleClick}>
      {/* <div className='chatInfo' onClick={handleClick} data-id={id} data-name={name} data-avatar={avatar} data-bio={bio}> */}
      <div className="friendProfileBox">
        {
          avatar && (
            <img src={avatar} alt="User Profile" />
          )
        }
        {
          !avatar && (
            <img src={noProfileAvatar} alt="User Profile" />
          )
        }
      </div>
      {
        name && (
          <h4>{name}</h4>
        )
      }
      {/* <p>{message}</p> */}
    </div>
  );
}

export default ChattingWith;
export { ChatContext };