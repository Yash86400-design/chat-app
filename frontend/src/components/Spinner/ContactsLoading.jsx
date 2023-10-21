import React from 'react';
import './contactsLoading.css';

function ContactsLoading({ text = 'Contacts Loading...' }) {
  return (
    <div className='contactsListLoadingContainer'>
      <span>{text}</span>
    </div>
  );
}

export default ContactsLoading;