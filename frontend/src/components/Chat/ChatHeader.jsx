import React from 'react';
import './chatHeader.css';
import { BsFileImage, BsThreeDotsVertical } from 'react-icons/bs';

function ChatHeader({ userId, userName, userAvatar }) {
  const noProfileAvatar = 'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  return (
    <div className='chat__header-container'>
      <div className="chat__header-container_left">
        <div className="chat__header-container_left-profile">
          {
            userAvatar && (<img src={userAvatar} alt="UserProfile" />)
          }
          {
            !userAvatar && (
              <img src={noProfileAvatar} alt="User" />
            )
          }
        </div>
        {
          userName && (<p>{userName}</p>)
        }
      </div>
      <div className="chat__header-container_right">
        <BsFileImage />
        <BsThreeDotsVertical />
      </div>
    </div>
  );
}

export default ChatHeader;