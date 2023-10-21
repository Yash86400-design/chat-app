import React, { useContext, useEffect, useRef, useState } from 'react';
import './bodyHeader.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineBell } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import { acceptRequest, deleteAllNotifications, editInfo, readAllNotifications, readOneNotification, rejectRequest, reset, userData } from '../../features/userSlice';
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-toastify';
import ChatIdContext from '../../context/ChatIdContext';
import BodyHeaderLoading from '../Spinner/BodyHeaderLoading';

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

function BodyHeader({ socket: socketInstance, pageWidth }) {
  const noProfileAvatar = 'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  const { isLoading, userProfile, editProfileSuccess, editProfileSuccessResponse, createChatroomMessage, friendRequestResponseLoading, returnedFriendRequestResponse, notificationReadStatusCode, notificationDeleteStatusCode, addFriendResponseError } = useSelector((state) => state.userProfile);
  const { chatUserInfo } = useContext(ChatIdContext);

  const [showInfoBox, setShowInfoBox] = useState(false);
  const [showUserInfoBox, setShowUserInfoBox] = useState(false);
  const [infoButton, setInfoButton] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profile, setProfile] = useState('');
  const [closeIconState, setCloseIconState] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationStateActive, setIsNotificationStateActive] = useState(false);

  const dispatch = useDispatch();
  const infoBoxRef = useRef(null);
  const userInfoBoxRef = useRef(null);
  const infoEditRef = useRef(null);
  const notificationStateRef = useRef(null);

  const handleInfoButton = (event) => {
    event.stopPropagation();
    setIsNotificationStateActive(false);
    setCloseIconState(!closeIconState);
    setShowInfoBox(!showInfoBox);
    if (showUserInfoBox) {
      setShowUserInfoBox(false);
    }
  };

  const closeIconClick = () => {
    if (closeIconState && (showInfoBox || showUserInfoBox)) {
      setShowInfoBox(false);
      setShowUserInfoBox(false);
      setCloseIconState(false);
    }
  };

  const handleLogoutButton = (event) => {
    socketInstance.emit('deleteSocketOnLogout');
    dispatch(logout());
    dispatch(reset());
  };

  const handleUserInfoButton = (event) => {
    event.stopPropagation();
    setCloseIconState(true);
    setShowUserInfoBox(!showUserInfoBox);
    setShowInfoBox(false);
  };

  const handleEditProfileButton = (event) => {
    event.stopPropagation();
    setCloseIconState(true);
    setInfoButton(!infoButton);
    setShowUserInfoBox(false);
  };

  const handleNotificationClick = (event) => {
    event.stopPropagation();
    setShowInfoBox(false);
    setCloseIconState(false);
    setIsNotificationStateActive(!isNotificationStateActive);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append('name', name);
    formData.append('avatar', profile);
    formData.append('bio', bio);

    dispatch(editInfo(formData))
      .then(() => {
        setProfile('');
        setName('');
        setBio('');
        setInfoButton(false);
        dispatch(userData());
      });
    setCloseIconState(false);
  };

  const handleProfileChange = (event) => {
    setProfile(event.target.files[0]);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleFriendRequestAcceptAction = (notificationId, senderId, recipientId) => {
    const requiredData = { notificationId: notificationId, senderId: senderId, receiverId: recipientId };
    dispatch(acceptRequest(requiredData));
  };

  const handleFriendRequestRejectAction = (notificationId, senderId, recipientId) => {
    const requiredData = { notificationId: notificationId, senderId: senderId, receiverId: recipientId };
    dispatch(rejectRequest(requiredData));
  };

  // Not completing this read/unread feature
  const handleNotificationReadUnreadClick = (event) => {
    event.stopPropagation();
    const clickedLi = event.target.closest('li');
    if (clickedLi) {
      const value = clickedLi.getAttribute('value');
      const notificationId = clickedLi.getAttribute('notificationid');

      if (value !== 'friendRequest' && !clickedLi.classList.contains('notificationRead')) {
        // Remove the "notificationUnRead" class and add the "notificationRead" class
        clickedLi.classList.remove('notificationUnRead');
        clickedLi.classList.add('notificationRead');
        setNotificationCount(notificationCount - 1);
        dispatch(readOneNotification(notificationId));
      }
    }
  };

  // Reading all notifications button
  const handleReadAllNotifications = (event) => {
    event.stopPropagation();
    // const notificationsList = document.getElementById('notificationList');

    // const liElements = notificationsList.getElementsByTagName('li');

    // let count = 0; //

    // for (const li of liElements) {
    //   const liValue = li.getAttribute('value');
    //   if (liValue !== 'friendRequest' && !li.classList.contains('notificationRead')) {
    //     li.classList.remove('notificationUnRead');
    //     li.classList.add('notificationRead');
    //     count += 1;
    //   }
    // }

    // setNotificationCount(notificationCount - count);
    dispatch(readAllNotifications());
  };

  // Deleting all notifications button
  const handleDeleteAllNotifications = (event) => {
    event.stopPropagation();
    // const notificationsList = document.getElementById('notificationList');

    // if (notificationsList) {
    //   const liElements = notificationsList.getElementsByTagName('li');
    //   for (let i = liElements.length - 1; i >= 0; i--) {
    //     const li = liElements[i];
    //     notificationsList.removeChild(li);
    //   }
    // }

    // const parentDiv = document.getElementById('notificationListContainerId');

    // // Also removing the buttons container once all the notifications gets deleted
    // if (parentDiv && parentDiv.children.length >= 2) {
    //   const secondChildDiv = parentDiv.children[1];

    //   parentDiv.removeChild(secondChildDiv);
    // }

    // const newLi = document.createElement('li');
    // newLi.className = 'noNotification';
    // newLi.textContent = 'No Notification Found';

    // notificationsList.appendChild(newLi);

    // setNotificationCount(0);
    dispatch(deleteAllNotifications());
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (infoBoxRef.current && !infoBoxRef.current.contains(event.target)) ||
        (userInfoBoxRef.current && !userInfoBoxRef.current.contains(event.target)) ||
        (infoEditRef.current && !infoEditRef.current.contains(event.target)) ||
        (notificationStateRef.current && !notificationStateRef.current.contains(event.target))
      ) {
        setCloseIconState(false);
        setShowInfoBox(false);
        setShowUserInfoBox(false);
        setInfoButton(false);
        setIsNotificationStateActive(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Re-render the component when userProfile has some changes
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setBio(userProfile.bio);
      setProfile(userProfile.avatar);
      let count = 0;
      for (let i = 0; i < userProfile.notifications.length; i++) {
        if (userProfile.notifications[i].read === false) {
          count += 1;
        }
      }
      setNotificationCount(count);
    }
  }, [userProfile]);

  useEffect(() => {
    if (editProfileSuccess && editProfileSuccessResponse?.editProfileSuccessUserId === userProfile?._id) {
      toast.success(editProfileSuccessResponse.message);
    }
  }, [editProfileSuccess, editProfileSuccessResponse, userProfile?._id]);

  useEffect(() => {
    if (returnedFriendRequestResponse === 200) {
      dispatch(userData());
    }
  }, [returnedFriendRequestResponse, dispatch]);

  useEffect(() => {
    if (notificationReadStatusCode === 200 || notificationDeleteStatusCode === 200) {
      dispatch(userData());
    }

    if (notificationReadStatusCode !== 200 && notificationReadStatusCode !== null) {
      console.log(notificationReadStatusCode);
      toast.warning('An error encountered during reading notification...');
    }
  }, [notificationReadStatusCode, notificationDeleteStatusCode, dispatch]);

  if (isLoading) {
    return <BodyHeaderLoading />;
  }

  if (friendRequestResponseLoading) {
    return <Spinner />;
  }

  // if (notificationDeletePending) {
  //   console.log(notificationDeletePending);
  //   return <BodyHeaderLoading />;
  // }

  if (addFriendResponseError) {
    toast.error(addFriendResponseError);
  }

  if (createChatroomMessage) {
    toast.success(createChatroomMessage);
  }

  // if (notificationReadStatusCode !== 200) {
  //   toast.warning('An error encountered during reading notification..');
  // }

  return (
    <>
      <div className={`body__header-container ${pageWidth < 768 ? `${chatUserInfo.id === '' ? 'bodyHeaderActive' : 'bodyHeaderInActive'}` : ''}`}>
        <div className="body__header-container_profile">
          {userProfile && (
            <img src={userProfile.avatar ? userProfile.avatar : noProfileAvatar} alt="" />
          )}
        </div>
        <div className="body__header-container_icons">
          <div className="notification-icon" onClick={handleNotificationClick}>
            <AiOutlineBell className='body__header-container_notification' />

            {notificationCount > 0 && (
              <span className='notification-count'>{notificationCount}</span>
            )}
          </div>

          {
            isNotificationStateActive && userProfile?.notifications.length > 0 && (
              <div className="notificationList" ref={notificationStateRef} id='notificationListContainerId'>
                <ul id='notificationList'>
                  {userProfile.notifications.map((notification, index) => (
                    <li key={index} className={`notification ${notification.notificationType} ${notification.read ? 'notificationRead' : 'notificationUnRead'}`} onClick={handleNotificationReadUnreadClick} value={notification.notificationType} notificationid={notification._id}>
                      {notification.title}
                      <p>Created At: <span>{formatTimestamp(notification.createdAt)}</span></p>
                      {notification.notificationType === 'friendRequest' && (
                        <div className='friendRequestButtonsGroup'>
                          <button className='acceptButton' onClick={() => handleFriendRequestAcceptAction(notification._id, notification.sender, notification.recipient)}>Accept</button>
                          <button className='rejectButton' onClick={() => handleFriendRequestRejectAction(notification._id, notification.sender, notification.recipient)}>Reject</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="notificationButtons">
                  <button className='readAll' onClick={handleReadAllNotifications}>Read All</button>
                  <button className='deleteAll' onClick={handleDeleteAllNotifications}>Delete All</button>
                </div>
              </div>
            )
          }

          {
            isNotificationStateActive && userProfile?.notifications.length === 0 && (
              <div className="notificationList" ref={notificationStateRef}>
                <ul>
                  <li className='noNotification'>No Notification Found</li>
                </ul>
              </div>
            )
          }

          {closeIconState
            ?
            <RxCross1 className='body__header-container_info crossIcon' onClick={closeIconClick} />  // Same class cause of styles applied on className
            :
            <BsThreeDotsVertical className='body__header-container_info' onClick={handleInfoButton} />
          }
        </div>
        {showInfoBox &&
          (
            <div className="infoBox" ref={infoBoxRef}>
              <ul>
                <li onClick={handleUserInfoButton}>Info</li>
                <li onClick={handleLogoutButton}>Logout</li>
              </ul>
            </div>
          )
        }
        {showUserInfoBox &&
          (
            <div className="userInfoBox" ref={userInfoBoxRef}>
              <div className="imgBox">
                <img src={userProfile.avatar ? userProfile.avatar : ''} alt="" />
              </div>
              <h2>{userProfile.name ? userProfile.name : ''}</h2>
              <p>{userProfile.bio ? userProfile.bio : 'Add a bio'}</p>
              <button onClick={handleEditProfileButton}>Edit</button>
            </div>
          )
        }
        {infoButton &&
          (
            <div className="infoEditForm" ref={infoEditRef}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="profile">New Profile: </label>
                <input
                  type='file'
                  id='profile'
                  name='profile'
                  accept='image/*'
                  onChange={handleProfileChange}
                />

                <label htmlFor="name">New Name: </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={name}
                  onChange={handleNameChange}
                />

                <label htmlFor="bio">New Bio: </label>
                <input type='text' name="bio" id="bio" value={bio} onChange={handleBioChange} cols="30" rows="10"></input>

                <button type="submit">Submit</button>
              </form>
            </div>
          )
        }

      </div>
    </>
  );
}

export default BodyHeader;