import { useEffect, useRef, useState } from 'react';
import './chatHeader.css';
import { BsPersonAdd, BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineBell } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { TbRefresh } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addRequest, chatroomInfo, deleteAllChatroomNotifications, editChatroomInfo, exitChatroom, fetchChatroomMessages, fetchUserMessages, groupJoinAccept, groupJoinReject, readAllChatroomNotifications, toastReset, unfriendUser, userData } from '../../features/userSlice';
import ChatroomHeaderSpinner from '../Spinner/ChatroomHeaderSpinner';

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function getChatroomInfoFromLocalStorage(userId) {
  // Retrieve data from localStorage
  const storedChatroomInfo = JSON.parse(localStorage.getItem('chatroomInfo'));
  // Assuming you have a specific chatroomId or key to access the data
  const chatroomId = userId;
  if (storedChatroomInfo) {
    const chatroomInfo = storedChatroomInfo[chatroomId];
    if (chatroomInfo) {
      return chatroomInfo;
    }
  }
  return null;
}

function ChatHeader({ userId, userName, userAvatar, userBio, userType, isKnown }) {

  const dispatch = useDispatch();
  const [friendInfoBoxActive, setFriendInfoBoxActive] = useState(false);
  const [chatroomInfoBoxActive, setChatroomInfoBoxActive] = useState(false);
  const [showFriendInfoBox, setShowFriendInfoBox] = useState(false);
  const [showChatroomInfoBox, setShowChatroomInfoBox] = useState(false);
  const [chatroomInfoButtonState, setChatroomInfoButtonState] = useState(false);
  const [closeIconState, setCloseIconState] = useState(false);
  const [isNotificationStateActive, setIsNotificationStateActive] = useState(false);
  const [chatroomData, setChatroomData] = useState(null);
  const [chatroomName, setChatroomName] = useState('');
  const [chatroomDescription, setChatroomDescription] = useState('');
  const [chatroomProfile, setChatroomProfile] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentAdminIndex, setCurrentAdminIndex] = useState(0);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const friendInfoBoxRef = useRef(null);
  const chatroomInfoBoxRef = useRef(null);
  const friendInfoRef = useRef(null);
  const chatroomInfoRef = useRef(null);
  const chatroomNotificationStateRef = useRef(null);
  const chatroomInfoEditRef = useRef(null);

  const
    {
      userProfile,
      addRequestLoading,
      addRequestResponseMessage,
      addRequestResponseSenderId,
      addRequestResponseChatroomId,
      addRequestResponseStatusCode,
      addMemberResponseError,
      fetchChatroomLoading,
      chatroomRequestResponseLoading,
      unfriendUserLoading,
      exitChatroomLoading,
      editChatroomResponseStatusCode,
      editChatroomResponseMessage,
      editChatroomResponseAdminId,
      editedChatroomId,
      chatroomNotificationReadDeleteAdminId, chatroomNotificationReadDeleteMessage, chatroomNotificationReadDeleteStatusCode, chatroomNotificationReadDeleteRoomId, chatroomNotificationReadDeleteLoading,
      chatroomJoinRejectLoading,
      chatroomJoinRejectMessage,
      chatroomJoinRejectStatusCode,
      chatroomJoinRejectRoomId,
      chatroomJoinRejectAdminId
    }
      = useSelector((state) => state.userProfile);

  const noProfileAvatar =
    'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  const clearWaitingQueue = () => {
    toast.clearWaitingQueue();
  };

  const handleAddRequest = (event) => {
    event.stopPropagation();
    dispatch(addRequest({ type: userType, id: userId, senderId: userProfile._id }));
  };

  const handleChatroomEditProfileButton = (event) => {
    event.stopPropagation();
    setCloseIconState(true);
    setChatroomInfoButtonState(!chatroomInfoButtonState);
    // setShowChatroomInfoBox(false);
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
      setChatroomInfoButtonState(false);
      setCloseIconState(false);
    }
    // else if (closeIconState && (showChatroomInfoBox))
  };

  const handleNotificationClick = (event) => {
    event.stopPropagation();
    setChatroomInfoBoxActive(false);
    setCloseIconState(false);
    setIsNotificationStateActive(!isNotificationStateActive);
  };

  const handleJoinRequestAcceptAction = (notificationId, senderId, chatroomId) => {
    setIsNotificationStateActive(false);
    const requiredData = { notificationId: notificationId, senderId: senderId, chatroomId: chatroomId, acceptedByAdminId: userProfile._id };
    // Sending accepterAdminId for error handling
    dispatch(groupJoinAccept(requiredData));
  };

  const handleJoinRequestRejectAction = (notificationId, senderId, chatroomId) => {
    setIsNotificationStateActive(false);
    const requiredData = { notificationId: notificationId, senderId: senderId, chatroomId: chatroomId, rejectedByAdminId: userProfile._id };
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

  const handleChatroomReadAllNotifications = (event) => {
    event.stopPropagation();

    if (!isAdmin) {
      toast.error('You are not allowed only admins have authority for this action.');
    }
    if (userType === 'Chatroom' && notificationCount > 0) {
      const updatedArray = notifications.map((notification) => {
        if (notification.notificationType !== 'groupJoinRequest' && notification.read !== true) {
          const { read, ...rest } = notification;
          return { read: true, ...rest };
        }
        return notification;
      });
      setNotifications(updatedArray);
      const requiredData = { chatroomId: userId, adminId: userProfile._id };
      dispatch(readAllChatroomNotifications(requiredData));  // UserId is the id of current chatroom
      // dispatch(userData());
    }
  };

  const handleChatroomDeleteAllNotifications = (event) => {
    event.stopPropagation();

    if (!isAdmin) {
      toast.error('You are not allowed only admins have authority for this action.');
    }

    if (userType === 'Chatroom') {
      setNotifications([]);
      const requiredData = { chatroomId: userId, adminId: userProfile._id };
      dispatch(deleteAllChatroomNotifications(requiredData));
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

  const handleChatroomProfileChange = (event) => {
    setChatroomProfile(event.target.files[0]);
  };

  const handleChatroomNameChange = (event) => {
    setChatroomName(event.target.value);
  };

  const handleChatroomBioChange = (event) => {
    setChatroomDescription(event.target.value);
  };

  const handleChatroomEditFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append('name', chatroomName);
    formData.append('avatar', chatroomProfile);
    formData.append('description', chatroomDescription);

    dispatch(editChatroomInfo({ formData, chatroomId: userId }))
      .then(() => {
        setChatroomName('');
        setChatroomDescription('');
        setChatroomProfile('');
        setChatroomInfoButtonState(false);
        dispatch(userData());
      });
    setCloseIconState(false);
  };
  const showChatroomInfoPage = () => {
    return (
      <div className="chatroomInfoBox" ref={chatroomInfoRef}>
        <div className="chatroomMainDetailBox">
          <div className="item infoBoxTextContent">
            <h2> {userName ? userName : "No Name Set"} </h2>
            <p> {userBio !== null ? userBio : 'No Bio'} </p>
            <button onClick={handleChatroomEditProfileButton} disabled={isDisabled} className='chatroomInfoEditButton'>Edit</button>
          </div>
          <div className="item imgBox">
            <img src={userAvatar ? userAvatar : noProfileAvatar} alt="" />
          </div>
        </div>
        <div className="adminsMembersGroup">

          {
            chatroomData?.admins?.length > 0 && isKnown && (
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
            chatroomData?.members?.length > 0 && isKnown && (
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

          {
            !isKnown && (
              <div className='messageForUnknownUser'>
                <p>
                  Become a member to view the list of members and admins...
                </p>
              </div>
            )
          }
        </div>
        {chatroomInfoButtonState && (
          <div className="infoEditForm chatroomForm" ref={chatroomInfoEditRef}>
            <form onSubmit={handleChatroomEditFormSubmit}>
              <h5>Click Anywhere outside the form to close this form!</h5>
              <label htmlFor="profile">New Profile: </label>
              <input
                type='file'
                id='profile'
                name='profile'
                accept='image/*'
                onChange={handleChatroomProfileChange}
              />
              <label htmlFor="name">New Name: </label>
              <input
                type='text'
                id='name'
                name='name'
                value={chatroomName}
                onChange={handleChatroomNameChange}
              />
              <label htmlFor="description">New Description: </label>
              <input type='text' name="description" id="description" value={chatroomDescription} onChange={handleChatroomBioChange} cols="30" rows="10"></input>
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    );
  };

  const handleRefreshChatRoomAction = () => {
    dispatch(chatroomInfo({ id: userId }))
      // .then(() => {
      //   const updatedChatroomInfo = getChatroomInfoFromLocalStorage(userId);
      //   if (updatedChatroomInfo) {
      //     setChatroomData(updatedChatroomInfo);
      //   }
      // });
    if (userType === 'User') {
      dispatch(fetchUserMessages(userId));
    } else if (userType === 'Chatroom') {
      dispatch(fetchChatroomMessages(userId));
    }
  };

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
      if (
        (chatroomInfoEditRef.current &&
          !chatroomInfoEditRef.current.contains(event.target))
      ) {
        setChatroomInfoButtonState(false);
      }
    }
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Add request use-effect
  useEffect(() => {
    if (addRequestResponseMessage.length > 0 && userProfile._id === addRequestResponseSenderId && userId === addRequestResponseChatroomId && addRequestResponseStatusCode === 200) {
      toast.success(addRequestResponseMessage);
    }

    if (addRequestResponseMessage.length > 0 && userProfile._id === addRequestResponseSenderId && userId === addRequestResponseChatroomId && addRequestResponseStatusCode !== 200) {
      toast.error(addRequestResponseMessage);
    }

  }, [addRequestResponseMessage, userProfile, addRequestResponseChatroomId, addRequestResponseSenderId, userId, addRequestResponseStatusCode]);

  // Fetching the Chatroom Info from localstorage
  useEffect(() => {
    // Fetch the chatroomInfo from localStorage
    const chatroomInfoFromLocalStorage = getChatroomInfoFromLocalStorage(userId);
    if (chatroomInfoFromLocalStorage) {
      setChatroomData(chatroomInfoFromLocalStorage);
    }

    // If join request accepted or rejected
    if (
      chatroomJoinRejectStatusCode === 200 &&
      userProfile._id === chatroomJoinRejectAdminId &&
      chatroomJoinRejectRoomId === userId
    ) {
      // Dispatch the request to get fresh data of the chatroom
      dispatch(chatroomInfo({ id: userId }))
        .then(() => {
          // Retrieve data from localStorage after the request is completed
          const updatedChatroomInfo = getChatroomInfoFromLocalStorage(userId);
          if (updatedChatroomInfo) {
            setChatroomData(updatedChatroomInfo);
          }
        });
    }

  }, [chatroomJoinRejectAdminId, chatroomJoinRejectMessage, chatroomJoinRejectRoomId, chatroomJoinRejectStatusCode, dispatch, userId, userProfile]);  // UserId is chatroom Id

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].read === false) {
        count += 1;
      }
    }
    setNotificationCount(count);
  }, [notifications]);

  useEffect(() => {
    if (chatroomData && Object.keys(chatroomData).length !== 0) {
      setNotifications([...chatroomData.notifications]);
      const isCurrentUserAdmin = chatroomData.admins.some((admin) => admin.id.toString() === userProfile?._id);
      if (isCurrentUserAdmin) {
        setIsAdmin(true);
        setIsDisabled(false);
      }
    }

  }, [chatroomData, userProfile]);

  useEffect(() => {
    if (chatroomNotificationReadDeleteStatusCode === 200 && userProfile._id === chatroomNotificationReadDeleteAdminId && chatroomNotificationReadDeleteRoomId === userId) {
      dispatch(chatroomInfo({ id: userId }))
        .then(() => {
          // Retrieve data from localStorage after the request is completed
          const updatedChatroomInfo = getChatroomInfoFromLocalStorage(userId);
          if (updatedChatroomInfo) {
            setChatroomData(updatedChatroomInfo);
          }
        });
      toast.success(chatroomNotificationReadDeleteMessage);
      dispatch(toastReset());
      setIsNotificationStateActive(false);
    }

    if (chatroomNotificationReadDeleteStatusCode !== 200 && userProfile._id === chatroomNotificationReadDeleteAdminId && chatroomNotificationReadDeleteRoomId === userId) {
      toast.error(chatroomNotificationReadDeleteMessage);
      dispatch(toastReset());
      setIsNotificationStateActive(false);
    }
  }, [chatroomNotificationReadDeleteAdminId, chatroomNotificationReadDeleteMessage, chatroomNotificationReadDeleteStatusCode, chatroomNotificationReadDeleteRoomId, userId, userProfile, dispatch]);

  useEffect(() => {
    if (editChatroomResponseStatusCode === 200 && editChatroomResponseAdminId === userProfile._id && userId === editedChatroomId) {
      toast.success(editChatroomResponseMessage);
      dispatch(toastReset());
    } else if (editChatroomResponseStatusCode !== 200 && editChatroomResponseAdminId === userProfile._id && userId === editedChatroomId) {
      toast.error(editChatroomResponseMessage);
      dispatch(toastReset());
    }
  }, [editChatroomResponseMessage, editChatroomResponseAdminId, editChatroomResponseStatusCode, userProfile, editedChatroomId, userId, dispatch]);

  if (addMemberResponseError) {
    toast.error(addMemberResponseError);
  }

  if (unfriendUserLoading) {
    dispatch(userData());
  }

  if (exitChatroomLoading) {
    dispatch(userData());
  }

  if (chatroomNotificationReadDeleteLoading || chatroomJoinRejectLoading) {
    return <ChatroomHeaderSpinner />;
  }

  if (addRequestLoading) {
    return <ChatroomHeaderSpinner />;
  }

  if (chatroomRequestResponseLoading) {
    return <ChatroomHeaderSpinner />;
  }

  if (fetchChatroomLoading) {
    return <ChatroomHeaderSpinner />;
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
        {isKnown && (
          <div className="refreshChatroomIconContainer" onClick={handleRefreshChatRoomAction}>
            <TbRefresh className='chat__header-container_refreshIcon' />
            <div className="hoverTextForRefreshIcon">Refresh</div>
          </div>
        )}

        {isKnown && (
          <div className='infoIconContainer'>
            {renderInfoButtonContent()}
          </div>
        )}
      </div>
      {
        isNotificationStateActive && notifications.length > 0 && (
          <div className="chatroomNotificationList" ref={chatroomNotificationStateRef}>
            <ul>
              {notifications.map((notification, index) => (
                <li key={index} className={`notification ${notification.notificationType} ${notification.read ? 'notificationRead' : 'notificationUnRead'}`}>
                  {notification.title}
                  <p>Created At: <span>{formatTimestamp(notification.createdAt)}</span></p>
                  {notification.notificationType === 'groupJoinRequest' && (
                    <div className='joinRequestButtonsGroup'>
                      <button className={`chatroomAcceptButton ${isDisabled ? 'buttonDisabled' : 'buttonEnabled'}`} onClick={(event) => {
                        event.stopPropagation();
                        handleJoinRequestAcceptAction(notification._id, notification.sender, chatroomData._id);
                      }}
                      >Accept</button>
                      <button className={`chatroomRejectButton ${isDisabled ? 'buttonDisabled' : 'buttonEnabled'}`} onClick={(event) => {
                        event.stopPropagation();
                        handleJoinRequestRejectAction(notification._id, notification.sender, chatroomData._id);
                      }}>Reject</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="notificationButtons">
              <button className={`readAll ${isDisabled ? 'buttonDisabled' : 'buttonEnabled'}`} disabled={isDisabled} onClick={handleChatroomReadAllNotifications}>Read All</button>
              <button className={`deleteAll ${isDisabled ?
                'buttonDisabled' : 'buttonEnabled'}`} disabled={isDisabled} onClick={handleChatroomDeleteAllNotifications}>Delete All</button>
            </div>
          </div>
        )
      }
      {
        isNotificationStateActive && notifications.length === 0 && (
          <div className="chatroomNotificationList" ref={chatroomNotificationStateRef}>
            <ul>
              <li className='noNotification'>No Notification Found</li>
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
