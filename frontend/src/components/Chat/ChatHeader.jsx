import React from 'react';
import './chatHeader.css';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';

function ChatHeader({ userId, userName, userAvatar, userBio, userType }) {
  const noProfileAvatar =
    'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  const { userProfile } = useSelector((state) => state.userProfile);

  // const allChats = userProfile.joinedPersonalChats.concat(userProfile.joinedChatrooms);

  const isFriend = userProfile.joinedPersonalChats.includes(userId);
  const isChatroomMember = userProfile.joinedChatrooms.includes(userId);

  const renderAddButtonContent = () => {

    if (isFriend) {
      return (
        <>
          <span className="tooltip">Already a friend</span>
          <BsPersonAdd className="addPersonIcon disabled" />
        </>
      );
    } else if (isChatroomMember) {
      return (
        <>
          <span className="tooltip">Already a member</span>
          <BsPersonAdd className="addPersonIcon disabled" />
        </>
      );
    } else {
      return (
        <>
          <span className="tooltip">
            {userType === 'Chatroom' ? 'Become a member' : 'Add Friend'}
          </span>
          <BsPersonAdd className="addPersonIcon" />
        </>
      );
    }
  };

  const renderInfoButtonContent = () => {
    if (isFriend) {
      return (
        <>
          <BsThreeDotsVertical className="infoIcon enabled" />
        </>
      );
    } else if (isChatroomMember) {
      return (
        <>
          <BsThreeDotsVertical className="infoIcon enabled" />
        </>
      );
    } else {
      return (
        <>
          <span className='tooltip'>
            {userType === 'Chatroom' ? 'Only for members' : 'Only for friends'}
          </span>
          <BsThreeDotsVertical className='infoIcon disabled' />
        </>
      );
    }

  };

  return (
    <div className="chat__header-container">
      <div className="chat__header-container_left">
        <div className="chat__header-container_left-profile">
          {userAvatar && <img src={userAvatar} alt="UserProfile" />}
          {!userAvatar && <img src={noProfileAvatar} alt="User" />}
        </div>
        {userName && (
          <p>
            {userName}
            {userBio && <strong> ({userBio.slice(0, 15) + '...'}) </strong>}
          </p>
        )}
      </div>
      <div className="chat__header-container_right">
        <div className={`addIconContainer ${isFriend || isChatroomMember ? 'disabled' : ''}`}>
          {renderAddButtonContent()}
        </div>
        <div className={`infoIconContainer ${isFriend || isChatroomMember ? '' : 'disabled'}`}>
          {renderInfoButtonContent()}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
