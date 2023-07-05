import React from 'react';
import './bodyContacts.css';
import BodySearchContacts from './BodySearchContacts';
import ChatContacts from './ChatContacts';

function BodyContacts({ socket }) {
  return (
    <div className='bodyContacts'>
      <BodySearchContacts />
      <ChatContacts socket={socket} />
    </div>
  );
}

export default BodyContacts;