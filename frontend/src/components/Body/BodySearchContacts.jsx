import React, { useContext, useEffect, useRef, useState } from 'react';
import './bodySearchContacts.css';
import userService from '../../services/userService';
import ChatIdContext from '../../context/ChatIdContext';
// import { AiOutlineSearch } from "react-icons/ai";

function BodySearchContacts() {
  const [partialQuery, setPartialQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const searchBarRef = useRef(null);
  const { setChatUserInfo } = useContext(ChatIdContext);

  const noProfileAvatar = 'https://res.cloudinary.com/duxhnzvyw/image/upload/v1685522479/Chat%20App/No_Profile_Image_xqa17x.jpg';

  const handleChange = async (event) => {
    let userTypedValue = event.target.value;
    setPartialQuery(userTypedValue);

    if (userTypedValue !== '') {
      const users = await userService.fetchSuggestedTerms(partialQuery);
      // console.log(suggestedUsers);
      setSuggestedUsers(users);
    } else {
      setSuggestedUsers([]);
    }
  };

  const clickedUser = (event) => {
    // console.log(event.target.getAttribute("value"));
    // console.log(event.currentTarget.getAttribute('value')); //both are correct
    const name = event.target.dataset.name;
    const avatar = event.target.dataset.avatar;
    const id = event.target.dataset.id;
    const bio = event.target.dataset.bio;
    setChatUserInfo({ id, name, avatar, bio });
  };

  const inputClick = (event) => {
    event.stopPropagation();
    setSearchBarActive(true);
  };

  useEffect(() => {
    function handleClickOutsite(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setPartialQuery('');
        setSuggestedUsers([]);
        setSearchBarActive(false);
      }
    }
    document.addEventListener('click', handleClickOutsite);

    return () => {
      document.removeEventListener('click', handleClickOutsite);
    };
  }, []);

  return (
    <div className='bodySearchContacts' ref={searchBarRef}>
      <div className="searchBar">
        {/* Let's first implement the basic search then in the end for finishing touch we will add search icon... */}
        {/* <div className="searchIcon">
          <AiOutlineSearch className='searchIcon' />
        </div> */}
        <input type="text" value={partialQuery} placeholder='Find Your Friend/Group...' onClick={inputClick} onChange={handleChange} />
      </div>
      {suggestedUsers.length > 0 && searchBarActive && (
        <div className="suggestedUsers">
          <ul>
            {/* <li key={index} onClick={clickedUser} value={user[0].avatar}> */}
            {suggestedUsers.map((user, index) => (
              <li key={index} onClick={clickedUser} data-id={user[0].id} data-name={user[0].name} data-avatar={user[0].avatar} data-bio={user[0].bio}>

                <span>{user[0].avatar ? (
                  <img src={user[0].avatar} alt="User" />
                ) : (
                  <img src={noProfileAvatar} alt="Fallback" />  // Fallback image if there is none
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
  );
}

export default BodySearchContacts;