import React from 'react';
import './bodyContacts.css';
import BodySearchContacts from './BodySearchContacts';
import ChatContacts from './ChatContacts';

function BodyContacts() {
  return (
    <div className='bodyContacts'>
      <BodySearchContacts />
      <ChatContacts />
    </div>
  );
}

export default BodyContacts;