import React, { useEffect, useRef, useState } from 'react';
import './bodyHeader.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import { editInfo, userData, userInfo } from '../../features/userSlice';

function BodyHeader() {
  const { userProfile } = useSelector((state) => state.auth);
  const { isError, isSuccess, isLoading, message } = useSelector((state) => state.userProfile);

  const [showInfoBox, setShowInfoBox] = useState(false);
  const [showUserInfoBox, setShowUserInfoBox] = useState(false);
  const [infoButton, setInfoButton] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profile, setProfile] = useState('');

  const dispatch = useDispatch();
  const infoBoxRef = useRef(null);
  const userInfoBoxRef = useRef(null);
  const infoEditRef = useRef(null);

  // const { avatar, name, bio } = localStorage.getItem('userProfile');

  const handleInfoButton = (event) => {
    event.stopPropagation();
    setShowInfoBox(!showInfoBox);
    if (showUserInfoBox) {
      setShowUserInfoBox(false);
    }
  };

  const handleLogoutButton = (event) => {
    dispatch(logout());
  };

  const handleUserInfoButton = (event) => {
    event.stopPropagation();
    setShowUserInfoBox(!showUserInfoBox);
    setShowInfoBox(false);
  };

  const handleEditProfileButton = (event) => {
    event.stopPropagation();
    setInfoButton(!infoButton);
    setShowUserInfoBox(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(profile, name, bio);
    // dispatch(editInfo({ profile: profile, name: name, bio }));

    const formData = new FormData();
    formData.append('avatar', profile);
    formData.append('name', name);
    formData.append('bio', bio);

    console.log(formData);
    dispatch(editInfo(formData));
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

  // When the edit Info returns success
  useEffect(() => {
    if (isSuccess) {
      console.log('Hi');
      dispatch(userInfo());
    }
  }, [isSuccess, dispatch]);

  return (
    <div className='body__header-container'>
      <div className="body__header-container_profile">
        <img src={userProfile ? userProfile.avatar : ''} alt="Profile" />
      </div>
      <div className="body__header-container_icons" onClick={handleInfoButton}>
        {/* <BsFillChatLeftTextFill className='chat_left_icon' /> */}
        <BsThreeDotsVertical className='body__header-container_info' />
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
              <img src={userProfile ? userProfile.avatar : ''} alt="" />
            </div>
            <h2>{userProfile ? userProfile.name : ''}</h2>
            <p>{userProfile ? userProfile.bio : 'Add a bio'}</p>
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


