import React from 'react';
import './bodyContacts.css';
import BodySearchContacts from './BodySearchContacts';
import ChatContacts from './ChatContacts';

function BodyContacts({ socket, pageWidth }) {
  return (
    <div className='bodyContacts'>
      <BodySearchContacts pageWidth={pageWidth}/>
      <ChatContacts socket={socket} pageWidth={pageWidth} />
    </div>
  );
}

export default BodyContacts;