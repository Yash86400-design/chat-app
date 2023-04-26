import React from 'react';
import './bodyContainer.css'
import BodyHeader from './BodyHeader';
import BodyContacts from './BodyContacts';

function BodyContainer() {
  return (
    <div className='bodyContent'>
      <BodyHeader />
      <BodyContacts />
    </div>
  );
}

export default BodyContainer;