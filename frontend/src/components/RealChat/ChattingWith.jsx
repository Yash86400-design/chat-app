import React from 'react';
import './chattingWith.css';

function ChattingWith({ name, message }) {

  return (
    <div className='chatInfo'>
      <h4>{name}</h4>
      <p>{message}</p>
    </div>
  );
}

export default ChattingWith;