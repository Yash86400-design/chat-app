import React, { useEffect, useRef, useState } from 'react';
import './chatHeader.css';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';

function ChatHeader({ userId, userName, userAvatar, userBio, userType }) {

  const [showFriendInfoBox, setShowFriendInfoBox] = useState(false);
  const [showChatroomInfoBox, setShowChatroomInfoBox] = useState(false);
  const friendInfoBoxRef = useRef(null);
  const chatroomInfoBoxRef = useRef(null);

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
          {/* <BsPersonAdd className="addPersonIcon disabled" /> */}
          <BsPersonAdd />
        </>
      );
    } else if (isChatroomMember) {
      return (
        <>
          <span className="tooltip">Already a member</span>
          {/* <BsPersonAdd className="addPersonIcon disabled" /> */}
          <BsPersonAdd />
        </>
      );
    } else {
      return (
        <>
          <span className="tooltip">
            {userType === 'Chatroom' ? 'Become a member' : 'Add Friend'}
          </span>
          {/* <BsPersonAdd className="addPersonIcon" /> */}
          <BsPersonAdd />
        </>
      );
    }
  };

  const renderInfoButtonContent = () => {
    if (isFriend) {
      return (
        <>
          {/* <BsThreeDotsVertical className="infoIcon enabled" onClick={handleFriendInfoClick} /> */}
          <BsThreeDotsVertical onClick={handleFriendInfoClick} />
        </>
      );
    } else if (isChatroomMember) {
      return (
        <>
          {/* <BsThreeDotsVertical className="infoIcon enabled" onClick={handleChatroomInfoClick} /> */}
          <BsThreeDotsVertical onClick={handleChatroomInfoClick} />
        </>
      );
    } else {
      return (
        <>
          <span className='tooltip'>
            {userType === 'Chatroom' ? 'Only for members' : 'Only for friends'}
          </span>
          {/* <BsThreeDotsVertical className='infoIcon disabled' /> */}
          <BsThreeDotsVertical />
        </>
      );
    }
  };

  const handleFriendInfoClick = (event) => {
    // Info
    // UnFriend
    event.stopPropagation();
    setShowFriendInfoBox(!showFriendInfoBox);
  };

  const handleChatroomInfoClick = (event) => {
    // Info
    // Leave Group
    event.stopPropagation();
    setShowChatroomInfoBox(!showChatroomInfoBox);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (friendInfoBoxRef.current && !friendInfoBoxRef.current.contains(event.target)) {
        console.log(friendInfoBoxRef.current);
        setShowFriendInfoBox(false);
      }
      if (chatroomInfoBoxRef.current && !chatroomInfoBoxRef.current.contains(event.target)) {
        setShowChatroomInfoBox(false);
        console.log(chatroomInfoBoxRef.current);
      }
    }
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
            {/* {userBio && <strong> ({userBio.slice(0, 15) + '...'}) </strong>} */}
            {userBio && <strong> ({userBio}) </strong>}
          </p>
        )}
      </div>
      <div className="chat__header-container_right">
        <div className={`addIconContainer ${isFriend || isChatroomMember ? 'disabled' : ''}`}>
          {/* <div className='addIconContainer'> */}
          {renderAddButtonContent()}
        </div>
        <div className={`infoIconContainer ${isFriend || isChatroomMember ? '' : 'disabled'}`}>
          {/* <div className='infoIconContainer'> */}
          {renderInfoButtonContent()}
        </div>
      </div>
      {showFriendInfoBox &&
        (
          <div className="infoBoxFriend" ref={friendInfoBoxRef}>
            <ul>
              <li>Info</li>
              <li>Unfriend</li>
            </ul>
          </div>
        )
      }
      {showChatroomInfoBox &&
        (
          <div className="infoBoxChatRoom" ref={chatroomInfoBoxRef}>
            <ul>
              <li>Info</li>
              <li>Leave Chatroom</li>
            </ul>
          </div>
        )
      }
    </div>
  );
}

export default ChatHeader;
