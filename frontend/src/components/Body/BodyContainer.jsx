import React from 'react';
import './bodyContainer.css';
import BodyHeader from './BodyHeader';
import BodyContacts from './BodyContacts';

function BodyContainer({ socket }) {
  return (
    <div className='bodyContent'>
      <BodyHeader />
      <BodyContacts socket={socket} />
    </div>
  );
}

export default BodyContainer;