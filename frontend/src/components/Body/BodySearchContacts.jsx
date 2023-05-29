import React, { useEffect, useRef, useState } from 'react';
import './bodySearchContacts.css';
import userService from '../../services/userService';
// import { AiOutlineSearch } from "react-icons/ai";

function BodySearchContacts() {
  const [partialQuery, setPartialQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchBarActive, setSearchBarActive] = useState(false);
  const searchBarRef = useRef(null);

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
    console.log(event.target.getAttribute("value"));
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
            {suggestedUsers.map((user, index) => (
              <li key={index} onClick={clickedUser} value={user.roomId}>{user.name}</li>
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