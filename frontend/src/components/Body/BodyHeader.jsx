import React from 'react';
import './bodyHeader.css';
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';

function BodyHeader() {
  // const { userProfile } = useSelector((state) => state.auth);
  return (
    <div className='body__header-container'>
      <div className="body__header-container_profile">
        <img src='https://res.cloudinary.com/duxhnzvyw/image/upload/v1649340980/Tiktok-videos/noun-cd-1368362-modified_nggzlu.png' alt="Profile" />
      </div>
      <div className="body__header-container_icons">
        <BsFillChatLeftTextFill className='chat_left_icon' />
        <BsThreeDotsVertical />
      </div>
    </div>
  );
}

export default BodyHeader;