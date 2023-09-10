import React, { useEffect, useRef, useState } from 'react';
import './bodyHeader.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineBell } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import { acceptRequest, editInfo, rejectRequest, userData } from '../../features/userSlice';
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-toastify';


function BodyHeader({ socket: socketInstance }) {
  // const { userProfile } = useSelector((state) => state.auth);
  const noProfileAvatar = 'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  const { isLoading, userProfile, editProfileSuccess, editProfileSuccessResponse, createChatroomMessage, friendRequestResponseLoading, returnedFriendRequestResponse, addFriendResponseError } = useSelector((state) => state.userProfile);

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

  // const { avatar, name, bio } = localStorage.getItem('userProfile');

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
    // console.log(profile, name, bio);
    // dispatch(editInfo({ profile: profile, name: name, bio }));

    const formData = new FormData();
    /*  I already handled the case of getting any value or not. 
    if (!name) {
      return toast.error("Name field can't be empty");
    }
    if (profile) {
      formData.append('avatar', profile);
    }
    if (bio) {
      formData.append('bio', bio);
    }
    */

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
    // Clear the form data --> Let's not do it, Cause through this I can show the user what's his current bio..
    // setProfile('')
    // setName('')
    // setBio('')
  };

  const handleProfileChange = (event) => {
    // setProfile(event.target.value); // This was the pretty damn error...
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
    // dispatch(userData());
  };

  const handleFriendRequestRejectAction = (notificationId, senderId, recipientId) => {
    const requiredData = { notificationId: notificationId, senderId: senderId, receiverId: recipientId };
    dispatch(rejectRequest(requiredData));
  };

  // Not completing this read/unread feature
  const handleNotificationReadUnreadClick = (event) => {
    event.stopPropagation();
  };
  // useEffect(() => {
  //   if (returnedFriendRequestResponse === 200) {
  //     window.location.reload();
  //   }
  // }, [returnedFriendRequestResponse]);

  /* Merged all three useEffect in a single useEffect down below... 
  useEffect(() => {
    function handleClickOutside(event) {
      if (infoBoxRef.current && !infoBoxRef.current.contains(event.target)) {
        setShowInfoBox(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userInfoBoxRef.current && !userInfoBoxRef.current.contains(event.target)) {
        setShowUserInfoBox(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (infoEditRef.current && !infoEditRef.current.contains(event.target)) {
        setInfoButton(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
*/

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


  // When the edit Info returns success --> Handled inside submit form..
  /*
  useEffect(() => {
    if (isSuccess) {
      console.log('Hi');
      dispatch(userData());
    }
  }, [isSuccess, dispatch]);
  */

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
      // setNotificationCount(userProfile.notifications.length);
      setNotificationCount(count);
    }
  }, [userProfile]);

  useEffect(() => {
    if (editProfileSuccess && editProfileSuccessResponse?.editProfileSuccessUserId === userProfile?._id) {
      // console.log(editProfileSuccessResponse?.editProfileSuccessUserId, userProfile?._id);
      toast.success(editProfileSuccessResponse.message);
    }
  }, [editProfileSuccess, editProfileSuccessResponse, userProfile]);

  useEffect(() => {
    if (returnedFriendRequestResponse === 200) {
      dispatch(userData());
    }
  }, [returnedFriendRequestResponse, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  if (friendRequestResponseLoading) {
    return <Spinner />;
  }

  if (addFriendResponseError) {
    toast.error(addFriendResponseError);
  }

  if (createChatroomMessage) {
    toast.success(createChatroomMessage);
  }

  return (
    <div className='body__header-container'>
      <div className="body__header-container_profile">
        {userProfile && (
          <img src={userProfile.avatar ? userProfile.avatar : noProfileAvatar} alt="" />
        )}
      </div>
      <div className="body__header-container_icons">
        {/* <BsFillChatLeftTextFill className='chat_left_icon' /> */}

        {/* I'm making a mistake here by not implementing styles on div instead using direct icons target... (Check ChatHeader.jsx for div styling) */}
        <div className="notification-icon" onClick={handleNotificationClick}>
          <AiOutlineBell className='body__header-container_notification' />

          {notificationCount > 0 && (
            <span className='notification-count'>{notificationCount}</span>
          )}
        </div>

        {
          isNotificationStateActive && userProfile?.notifications.length > 0 && (
            <div className="notificationList" ref={notificationStateRef}>
              {/* <p>Hello Guys</p> */}
              <ul>
                {userProfile.notifications.map((notification, index) => (
                  <li key={index} className={`notification ${notification.notificationType} ${notification.read ? 'notificationRead' : 'notificationUnRead'}`} onClick={handleNotificationReadUnreadClick}>
                    {notification.title}
                    {notification.notificationType === 'friendRequest' && (
                      <div className='friendRequestButtonsGroup'>
                        <button className='acceptButton' onClick={() => handleFriendRequestAcceptAction(notification._id, notification.sender, notification.recipient)}>Accept</button>
                        <button className='rejectButton' onClick={() => handleFriendRequestRejectAction(notification._id, notification.sender, notification.recipient)}>Reject</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
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
          <RxCross1 className='body__header-container_info' onClick={closeIconClick} />  // Same class cause of styles applied on className
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
              <textarea name="bio" id="bio" value={bio} onChange={handleBioChange} cols="30" rows="10"></textarea>

              <button type="submit">Submit</button>
            </form>
          </div>
        )
      }

    </div>
  );
}

export default BodyHeader;


