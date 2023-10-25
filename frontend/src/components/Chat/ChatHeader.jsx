import { useEffect, useRef, useState } from 'react';
import './chatHeader.css';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineBell } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../Spinner/Spinner';
import { addRequest, exitChatroom, groupJoinAccept, groupJoinReject, unfriendUser, userData } from '../../features/userSlice';

function ChatHeader({ userId, userName, userAvatar, userBio, userType, isKnown }) {

  const dispatch = useDispatch();
  const [friendInfoBoxActive, setFriendInfoBoxActive] = useState(false);
  const [chatroomInfoBoxActive, setChatroomInfoBoxActive] = useState(false);
  const [showFriendInfoBox, setShowFriendInfoBox] = useState(false);
  const [showChatroomInfoBox, setShowChatroomInfoBox] = useState(false);
  const [closeIconState, setCloseIconState] = useState(false);
  const [isNotificationStateActive, setIsNotificationStateActive] = useState(false);
  const [chatroomData, setChatroomData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentAdminIndex, setCurrentAdminIndex] = useState(0);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  const friendInfoBoxRef = useRef(null);
  const chatroomInfoBoxRef = useRef(null);
  const friendInfoRef = useRef(null);
  const chatroomInfoRef = useRef(null);
  const chatroomNotificationStateRef = useRef(null);

  const { addRequestLoading, returnedAddRequestResponse, addRequestError, addMemberResponseError, chatroomResponseLoading, chatroomRequestResponseLoading, unfriendUserLoading, exitChatroomLoading, returnedChatroomRequestResponse, userProfile } = useSelector((state) => state.userProfile);

  const noProfileAvatar =
    'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  const clearWaitingQueue = () => {
    toast.clearWaitingQueue();
  };

  const handleAddRequest = (event) => {
    event.stopPropagation();
    dispatch(addRequest({ type: userType, id: userId }));
  };

  const renderAddButtonContent = () => {

    return (
      <>
        <span className="tooltip">
          {userType === 'Chatroom' ? 'Become a member' : 'Add Friend'}
        </span>
        <BsPersonAdd onClick={handleAddRequest} className='chat__header-container_addIcon' />
      </>
    );
  };

  const renderInfoButtonContent = () => {
    if (isKnown && userType === 'User') {
      return (
        <>
          {closeIconState ? <RxCross1 onClick={closeIconClick} className='crossIcon' /> : <BsThreeDotsVertical onClick={handleFriendInfoClick} className='chat__header-container_infoIcon' />}
        </>
      );
    } else if (isKnown && userType === 'Chatroom') {
      return (
        <>
          {closeIconState ? <RxCross1 onClick={closeIconClick} className='crossIcon' /> : <BsThreeDotsVertical onClick={handleChatroomInfoClick} className='chat__header-container_infoIcon' />}
        </>
      );
    }
  };

  const showUserFriendInfoPage = () => {
    return (
      <div className="friendInfoBox" ref={friendInfoRef}>
        <div className="imgBox">
          <img src={userAvatar ? userAvatar : noProfileAvatar} alt="" />
        </div>
        <h2>{userName ? userName : "No Name Set"}</h2>
        <p>{(userBio === 'null' || userBio === null || userBio.length === 0) ? 'No Bio' : userBio}</p>
      </div>
    );
  };

  const showChatroomInfoPage = () => {
    return (
      <div className="chatroomInfoBox" ref={chatroomInfoRef}>
        <div className="chatroomMainDetailBox">
          <div className="imgBox">
            <img src={userAvatar ? userAvatar : noProfileAvatar} alt="" />
          </div>
          <h2> {userName ? userName : "No Name Set"} </h2>
          <p> {userBio !== null ? userBio : 'No Bio'} </p>
        </div>
        <div className="adminsMembersGroup">

          {
            chatroomData?.admins?.length > 0 && (
              <div className="adminContainer">
                <strong><p className='adminFirstParagraph'>Admins ({chatroomData?.admins.length}): </p></strong>
                <div className="admins">
                  <div className="adminImgContainer">
                    <img src={chatroomData?.admins[currentAdminIndex].avatar ? chatroomData?.admins[currentAdminIndex].avatar : noProfileAvatar} alt="" />
                  </div>
                  <div className="adminInfoContainer">
                    <p>Name: {chatroomData?.admins[currentAdminIndex]?.name}</p>
                    <p>Bio: {chatroomData?.admins[currentAdminIndex]?.bio}</p>
                    <p>ID: {chatroomData?.admins[currentAdminIndex]?.id}</p>
                    <p>Joined At: {new Date(chatroomData?.admins[currentAdminIndex]?.joinedAt).toLocaleDateString('IN')}</p>
                  </div>
                </div>
                <div className="adminNavigation">
                  <button onClick={showPreviousAdminCount} disabled={currentAdminIndex === 0}>Previous</button>
                  <button onClick={showNextAdminCount} disabled={currentAdminIndex === chatroomData.admins.length - 1}>Next</button>
                </div>
              </div>
            )
          }

          {
            chatroomData?.members?.length > 0 && (
              <div className="memberContainer">
                <strong><p className='memberFirstParagraph'>Members ({chatroomData?.members.length}): </p></strong>
                <div className="members">
                  <div className="memberImgContainer">
                    <img src={chatroomData?.members[currentMemberIndex].avatar ? chatroomData?.members[currentMemberIndex].avatar : noProfileAvatar} alt="" />
                  </div>
                  <div className="memberInfoContainer">
                    <p>Name: {chatroomData?.members[currentMemberIndex]?.name}</p>
                    <p>Bio: {chatroomData?.members[currentMemberIndex]?.bio}</p>
                    <p>ID: {chatroomData?.members[currentMemberIndex]?.id}</p>
                    <p>Joined At: {new Date(chatroomData?.admins[currentAdminIndex]?.joinedAt).toLocaleDateString('IN')}</p>
                  </div>
                </div>
                <div className="memberNavigation">
                  <button onClick={showPreviousMemberCount} disabled={currentMemberIndex === 0}>Previous</button>
                  <button onClick={showNextMemberCount} disabled={currentMemberIndex === chatroomData.members.length - 1}>Next</button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  };

  const handleFriendInfoClick = (event) => {
    event.stopPropagation();
    setCloseIconState(!closeIconState);
    setFriendInfoBoxActive(!friendInfoBoxActive);
  };

  const handleChatroomInfoClick = (event) => {
    event.stopPropagation();
    setIsNotificationStateActive(false);
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
    dispatch(unfriendUser(userId));
    // dispatch(userData());
  };
  const handleChatroomInfoAction = (event) => {
    event.stopPropagation();
    setCloseIconState(true);
    setShowChatroomInfoBox(!showChatroomInfoBox);
    setChatroomInfoBoxActive(false);
  };
  const handleLeaveChatroomAction = (event) => {
    event.stopPropagation();
    dispatch(exitChatroom(userId));
    // dispatch(userData());
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

  const handleNotificationClick = (event) => {
    event.stopPropagation();
    setChatroomInfoBoxActive(false);
    setCloseIconState(false);
    setIsNotificationStateActive(!isNotificationStateActive);
  };

  const handleJoinRequestAcceptAction = (notificationId, senderId, chatroomId) => {
    const requiredData = { notificationId: notificationId, senderId: senderId, chatroomId: chatroomId };
    dispatch(groupJoinAccept(requiredData));
  };

  const handleJoinRequestRejectAction = (notificationId, senderId, chatroomId) => {
    const requiredData = { notificationId: notificationId, senderId: senderId, chatroomId: chatroomId };
    dispatch(groupJoinReject(requiredData));
  };

  const handleDirectProfileView = (event) => {
    if (userType === 'Chatroom') {
      event.stopPropagation();
      setCloseIconState(!closeIconState);
      setShowChatroomInfoBox(!showChatroomInfoBox);
      setChatroomInfoBoxActive(false);
    } else if (userType === 'User') {
      event.stopPropagation();
      setCloseIconState(!closeIconState);
      setShowFriendInfoBox(!showFriendInfoBox);
      setFriendInfoBoxActive(false);
    }
  };

  const showNextAdminCount = () => {
    if (currentAdminIndex < chatroomData.admins.length - 1) {
      setCurrentAdminIndex(currentAdminIndex + 1);
    }
  };

  const showPreviousAdminCount = () => {
    if (currentAdminIndex > 0) {
      setCurrentAdminIndex(currentAdminIndex - 1);
    }
  };

  const showNextMemberCount = () => {
    if (currentMemberIndex < chatroomData.members.length - 1) {
      setCurrentMemberIndex(currentMemberIndex + 1);
    }
  };

  const showPreviousMemberCount = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
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
        (chatroomInfoRef.current && !chatroomInfoRef.current.contains(event.target))
        ||
        (chatroomNotificationStateRef.current && !chatroomNotificationStateRef.current.contains(event.target))
      ) {
        setCloseIconState(false);
        setFriendInfoBoxActive(false);
        setChatroomInfoBoxActive(false);
        setShowFriendInfoBox(false);
        setShowChatroomInfoBox(false);
        setIsNotificationStateActive(false);
      }
    }
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Add request use-effect
  useEffect(() => {
    if (returnedAddRequestResponse) {
      toast.success(returnedAddRequestResponse);
    }

    if (addRequestError) {
      toast.error(addRequestError);
    }

  }, [addRequestError, returnedAddRequestResponse, userProfile]);

  // Fetching the Chatroom Info from localstorage
  useEffect(() => {

    // Retrieve data from localStorage
    const storedChatroomInfo = JSON.parse(localStorage.getItem('chatroomInfo'));
    // Assuming you have a specific chatroomId or key to access the data
    const chatroomId = userId;
    if (storedChatroomInfo) {
      const chatroomInfo = storedChatroomInfo[chatroomId];
      if (chatroomInfo) {
        setChatroomData(chatroomInfo);
        let count = 0;
        for (let i = 0; i < chatroomInfo.notifications.length; i++) {
          if (chatroomInfo.notifications[i].read === false) {
            count += 1;
          }
        }
        setNotificationCount(count);
      }
    }

  }, [userId]);  // UserId is chatroom Id

  useEffect(() => {
    if (returnedChatroomRequestResponse === 200) {
      dispatch(userData());
      window.location.reload();
    }
  }, [returnedChatroomRequestResponse, dispatch]);

  if (addRequestLoading) {
    return <Spinner />;
  }

  if (chatroomResponseLoading) {
    return <Spinner />;
  }

  if (chatroomRequestResponseLoading) {
    return <Spinner />;
  }

  if (addMemberResponseError) {
    toast.error(addMemberResponseError);
  }

  if (unfriendUserLoading) {
    dispatch(userData());
  }

  if (exitChatroomLoading) {
    dispatch(userData());
  }

  clearWaitingQueue();

  return (
    <div className="chat__header-container">
      <div className="chat__header-container_left" onClick={handleDirectProfileView}>
        <div className="chat__header-container_left-profile">
          {userAvatar && <img src={userAvatar} alt="UserProfile" />}
          {!userAvatar && <img src={noProfileAvatar} alt="User" />}
        </div>
        {userName && (
          <p>
            {userName}
            {userBio && <strong> ({userBio.length < 0 ? 'No Bio' : `${userBio.slice(0, 5)}...`}) </strong>}
          </p>
        )}
      </div>
      <div className={`chat__header-container_right ${userType === 'Chatroom' ? 'chatroomHeader' : 'userHeader'}`}>
        {
          userType === 'Chatroom' && isKnown &&
          (
            <div className='notificationIconContainer' onClick={handleNotificationClick}>
              <AiOutlineBell className='chat__header-container_notificationIcon' />
              {notificationCount > 0 && (
                <span className='chatroom-notification-count'>{notificationCount}</span>
              )}
            </div>
          )
        }

        {!isKnown && (
          <div className='addIconContainer'>
            {renderAddButtonContent()}
          </div>
        )}

        <div className='infoIconContainer'>
          {renderInfoButtonContent()}
        </div>
      </div>
      {
        isNotificationStateActive && chatroomData.notifications.length > 0 && (
          <div className="chatroomNotificationList" ref={chatroomNotificationStateRef}>
            <ul>
              {chatroomData.notifications.map((notification, index) => (
                <li key={index} className={`notification ${notification.notificationType} ${notification.read ? 'notificationRead' : 'notificationUnRead'}`}>
                  {notification.title}
                  {notification.notificationType === 'groupJoinRequest' && (
                    <div className='joinRequestButtonsGroup'>
                      <button className='chatroomAcceptButton' onClick={() => handleJoinRequestAcceptAction(notification._id, notification.sender, chatroomData._id)}>Accept</button>
                      <button className='chatroomRejectButton' onClick={() => handleJoinRequestRejectAction(notification._id, notification.sender, chatroomData._id)}>Reject</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      }
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
          showUserFriendInfoPage()
        )
      }
      {
        showChatroomInfoBox &&
        (
          showChatroomInfoPage()
        )
      }
    </div >
  );
}

export default ChatHeader;
