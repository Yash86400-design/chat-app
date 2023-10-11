import React from 'react';
import './bodyContacts.css';
import ChatContacts from './ChatContacts';

function BodyContacts({ socket, pageWidth }) {
  return (
    <div className='bodyContacts'>
      <ChatContacts socket={socket} pageWidth={pageWidth} />
    </div>
  );
}

export default BodyContacts;