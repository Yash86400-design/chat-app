import React, { useContext, useEffect, useRef, useState } from 'react';
import './bodySearchContacts.css';
import userService from '../../services/userService';
import ChatIdContext from '../../context/ChatIdContext';
import { useSelector } from 'react-redux';

function BodySearchContacts({ pageWidth }) {
  const [partialQuery, setPartialQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const searchBarRef = useRef(null);
  const { setChatUserInfo } = useContext(ChatIdContext);
  const { chatUserInfo } = useContext(ChatIdContext);
  const { userProfile } = useSelector((state) => state.userProfile);

  const debounceTimeoutRef = useRef(null);

  const noProfileAvatar = 'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  const handleChange = (event) => {
    const userTypedValue = event.target.value;
    setPartialQuery(userTypedValue);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (userTypedValue !== '') {
        const users = await userService.fetchSuggestedTerms(userTypedValue);
        setSuggestedUsers(users);
      } else {
        setSuggestedUsers([]);
      }
    }, 300);

  };

  const clickedUser = (event) => {
    const name = event.target.dataset.name;
    const avatar = event.target.dataset.avatar;
    const id = event.target.dataset.id;
    const bio = event.target.dataset.bio;
    const type = event.target.dataset.type;
    let socketId = null;

    if (userProfile) {
      userProfile.joinedChats.map((user) => {
        if (user.id === id) {
          socketId = user.socketRoomId;
        }
        return null;
      });
    }
    setChatUserInfo({ id, name, avatar, bio, type, socketId });
  };

  const inputClick = (event) => {
    event.stopPropagation();
    setSearchBarActive(true);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setPartialQuery('');
        setSuggestedUsers([]);
        setSearchBarActive(false);
      }
    }
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={`bodySearchContacts ${pageWidth < 768 ? `${chatUserInfo.id === '' ? 'bodySearchContactsActive' : 'bodySearchContactsInActive'}` : ''}`} ref={searchBarRef}>
        <div className="searchBar">
          <input type="text" value={partialQuery} placeholder='Find Your Friend/Group...' onClick={inputClick} onChange={handleChange} />
        </div>
        {suggestedUsers.length > 0 && searchBarActive && (
          <div className="suggestedUsers">
            <ul>
              {suggestedUsers.map((user, index) => (
                <li key={index} onClick={clickedUser} data-id={user[0].id} data-name={user[0].name} data-avatar={user[0].avatar} data-bio={user[0].bio} data-type={user[0].type}>
                  <span>{user[0].avatar ? (
                    <img src={user[0].avatar} alt="User" />
                  ) : (
                    <img src={noProfileAvatar} alt="Fallback" />
                  )}</span> {user[0].name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {suggestedUsers.length === 0 && searchBarActive && (
          <div className="suggestedUsers">
            <ul>
              <li className='noUser'>No User Found...</li>
            </ul>
          </div>
        )}
      </div>
    </>

  );
}

export default BodySearchContacts;
