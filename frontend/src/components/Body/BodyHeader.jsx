import React from 'react';
import './bodyHeader.css';
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs';

function BodyHeader() {
  return (
    <div className='body__header-container'>
      <div className="body__header-container_profile">
        <img src="https://res.cloudinary.com/duxhnzvyw/image/upload/v1682079123/Chat%20App/pexels-yogendra-singh-3215733_voqlok.jpg" alt="Profile" />
      </div>
      <div className="body__header-container_icons">
        <BsFillChatLeftTextFill className='chat_left_icon' />
        <BsThreeDotsVertical />
      </div>
    </div>
  );
}

export default BodyHeader;