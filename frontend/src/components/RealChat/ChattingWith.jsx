import React from 'react';
import './chattingWith.css';

function ChattingWith({ name, avatar }) {
  const noProfileAvatar = 'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';
  return (
    <div className='chatInfo'>
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