import React from 'react';
import './bodyContainer.css';
import BodyHeader from './BodyHeader';
import BodyContacts from './BodyContacts';
import CreateChatroom from './CreateChatroom';

function BodyContainer({ socket }) {
  return (
    <div className='bodyContent'>
      <BodyHeader socket={socket} />
      <CreateChatroom />
      <BodyContacts socket={socket} />
    </div>
  );
}

export default BodyContainer;