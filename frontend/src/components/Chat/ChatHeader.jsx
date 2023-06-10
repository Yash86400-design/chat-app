import { useEffect, useRef, useState } from 'react';
import './chatHeader.css';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineBell } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
// import { useSelector } from 'react-redux';

function ChatHeader({ userName, userAvatar, userBio, userType, isFriend, isChatroomMember }) {

  const [friendInfoBoxActive, setFriendInfoBoxActive] = useState(false);
  const [chatroomInfoBoxActive, setChatroomInfoBoxActive] = useState(false);
  const [showFriendInfoBox, setShowFriendInfoBox] = useState(false);
  const [showChatroomInfoBox, setShowChatroomInfoBox] = useState(false);
  const [closeIconState, setCloseIconState] = useState(false);
  const friendInfoBoxRef = useRef(null);
  const chatroomInfoBoxRef = useRef(null);
  const friendInfoRef = useRef(null);
  const chatroomInfoRef = useRef(null);

  const noProfileAvatar =
    'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  // const allChats = userProfile.joinedPersonalChats.concat(userProfile.joinedChatrooms);

  // const { userProfile } = useSelector((state) => state.userProfile);

  // const isFriend = userProfile.joinedPersonalChats.includes(userId);
  // const isChatroomMember = userProfile.joinedChatrooms.includes(userId);

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
          {/* <BsThreeDotsVertical onClick={handleFriendInfoClick} /> */}
          {closeIconState ? <RxCross1 onClick={closeIconClick} /> : <BsThreeDotsVertical onClick={handleFriendInfoClick} />}
        </>
      );
    } else if (isChatroomMember) {
      return (
        <>
          {/* <BsThreeDotsVertical className="infoIcon enabled" onClick={handleChatroomInfoClick} /> */}
          {/* <BsThreeDotsVertical onClick={handleChatroomInfoClick} /> */}
          {closeIconState ? <RxCross1 onClick={closeIconClick} /> : <BsThreeDotsVertical onClick={handleChatroomInfoClick} />}
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
    event.stopPropagation();
    setCloseIconState(!closeIconState);
    setFriendInfoBoxActive(!friendInfoBoxActive);
  };

  const handleChatroomInfoClick = (event) => {
    event.stopPropagation();
    setCloseIconState(!closeIconState);
    setChatroomInfoBoxActive(!chatroomInfoBoxActive);
  };

  const handleFriendInfoAction = (event) => {
    event.stopPropagation();
    setCloseIconState(true);
    setShowFriendInfoBox(!showFriendInfoBox);
    setFriendInfoBoxActive(false);
  };
  const handleUnfriendAction = (event) => {
    event.stopPropagation();
  };
  const handleChatroomInfoAction = (event) => {
    event.stopPropagation();
    setCloseIconState(true);
    setShowChatroomInfoBox(!showChatroomInfoBox);
    setChatroomInfoBoxActive(false);
  };
  const handleLeaveChatroomAction = (event) => {
    event.stopPropagation();
  };

  const closeIconClick = () => {
    if (closeIconState && (showFriendInfoBox || friendInfoBoxActive)) {
      setShowFriendInfoBox(false);
      setFriendInfoBoxActive(false);
      setCloseIconState(false);
    } else if (closeIconState && (showChatroomInfoBox || chatroomInfoBoxActive)) {
      setShowChatroomInfoBox(false);
      setChatroomInfoBoxActive(false);
      setCloseIconState(false);
    }
  };

  // const handleChatroomInfoCloseClick = () => {

  // };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (friendInfoBoxRef.current && !friendInfoBoxRef.current.contains(event.target))
        ||
        (chatroomInfoBoxRef.current && !chatroomInfoBoxRef.current.contains(event.target))
        ||
        (friendInfoRef.current && !friendInfoRef.current.contains(event.target))
        ||
        (chatroomInfoRef.current && !chatroomInfoRef.current.contains(event.target))) {
        setCloseIconState(false);
        setFriendInfoBoxActive(false);
        setChatroomInfoBoxActive(false);
        setShowFriendInfoBox(false);
        setShowChatroomInfoBox(false);
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
        {
          userType === 'Chatroom' && isChatroomMember &&
          (
            <div className='notificationIconContainer'>
              <AiOutlineBell />
            </div>
          )
        }
        {
          userType === 'Chatroom' && !isChatroomMember &&
          (
            <div className='notificationIconContainer disabled'>
              <span>Not a member</span>
              <AiOutlineBell />
            </div>
          )
        }
        <div className={`addIconContainer ${isFriend || isChatroomMember ? 'disabled' : ''}`}>
          {/* <div className='addIconContainer'> */}
          {renderAddButtonContent()}
        </div>

        <div className={`infoIconContainer ${isFriend || isChatroomMember ? '' : 'disabled'}`}>
          {/* <div className='infoIconContainer'> */}
          {renderInfoButtonContent()}
        </div>
      </div>
      {
        friendInfoBoxActive &&
        (
          <div className="infoBoxFriend" ref={friendInfoBoxRef}>
            <ul>
              <li onClick={handleFriendInfoAction}>Info</li>
              <li onClick={handleUnfriendAction}>Unfriend</li>
            </ul>
          </div>
        )
      }
      {
        chatroomInfoBoxActive &&
        (
          <div className="infoBoxChatRoom" ref={chatroomInfoBoxRef}>
            <ul>
              <li onClick={handleChatroomInfoAction}>Info</li>
              <li onClick={handleLeaveChatroomAction}>Leave Chatroom</li>
            </ul>
          </div>
        )
      }
      {
        showFriendInfoBox &&
        (
          <div className="friendInfoBox" ref={friendInfoRef}>
            <div className="imgBox">
              <img src={userAvatar ? userAvatar : noProfileAvatar} alt="" />
            </div>
            <h2>{userName ? userName : "No Name Set"}</h2>
            <p>{userBio ? userBio : 'No Bio'}</p>
          </div>
        )
      }
      {
        showChatroomInfoBox &&
        (
          <div className="chatroomInfoBox" ref={chatroomInfoRef}>
            <div className="imgBox">
              <img src={userAvatar ? userAvatar : noProfileAvatar} alt="" />
            </div>
            <h2> {userName ? userName : "No Name Set"} </h2>
            <p> {userBio ? userBio : 'No Bio'} </p>
          </div>
        )
      }
    </div >
  );
}

export default ChatHeader;
