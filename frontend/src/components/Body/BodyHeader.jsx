import React, { useState } from 'react';
import './bodyHeader.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';

function BodyHeader() {
  const { userProfile } = useSelector((state) => state.auth);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const dispatch = useDispatch();

  const handleInfoButton = (event) => {
    setShowInfoBox(!showInfoBox);
  };

  const handleLogoutButton = (event) => {
    dispatch(logout());
  };
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
          <div className="infoBox">
            <ul>
              <li>Info</li>
              <li onClick={handleLogoutButton}>Logout</li>
            </ul>
          </div>
        )
      }
    </div>
  );
}

export default BodyHeader;