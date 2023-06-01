import React from 'react';
import './chatHeader.css';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';

function ChatHeader({ userId, userName, userAvatar, userBio }) {
  const noProfileAvatar = 'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  const { userProfile } = useSelector((state) => state.userProfile);
  // console.log(userProfile);
  // If 2nd person is friend or 1st person or 2nd person (group) has 1st person as member then do something
  // ---> Deactive the click on add button with a message
  // ---> Allowed to click on info button

  // If not then do something
  // ---> Active the click on add button
  // ---> Not allowed to click on info button

  // What info button will include
  // ---> Info About Person/Group
  // ---> Unfriend/Exit the group

  const allChats = userProfile.joinedPersonalChats.concat(userProfile.joinedChatrooms);

  console.log(allChats.includes(userId));

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
          userName && <p>{userName} {
            userBio && (
              <strong> ({userBio}) </strong>
            )
          }</p>
        }
      </div>
      <div className="chat__header-container_right">
        <BsPersonAdd className='addPersonIcon' />
        <BsThreeDotsVertical className='infoIcon' />
      </div>
    </div>
  );
}

export default ChatHeader;