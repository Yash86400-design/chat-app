import React from 'react';
import './bodySearchContacts.css';
import { AiOutlineSearch } from "react-icons/ai";

function BodySearchContacts() {
  return (
    <div className='bodySearchContacts'>
      <div className="searchBar">
        <input type="text" placeholder='       Search...' />
        <AiOutlineSearch className='searchIcon' />
      </div>
    </div>
  );
}

export default BodySearchContacts;