import React from 'react';
import './chatHeader.css';
import { BsFileImage, BsThreeDotsVertical } from 'react-icons/bs';

function ChatHeader() {
  return (
    <div className='chat__header-container'>
      <div className="chat__header-container_left">
        <div className="chat__header-container_left-profile">
          <img src="https://res.cloudinary.com/duxhnzvyw/image/upload/v1682079122/Chat%20App/pexels-yaroslav-shuraev-7166122_je2dhj.jpg" alt="User" />
        </div>
        <p>Harsh Pandey</p>
      </div>
      <div className="chat__header-container_right">
        <BsFileImage />
        <BsThreeDotsVertical />
      </div>
    </div>
  );
}

export default ChatHeader;