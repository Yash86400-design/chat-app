import React from 'react';
import './chatBody.css';

function ChatBody({ isKnown }) {

  return (
    <>
      {
        isKnown && (
          <div className='chatBody'>

          </div>
        )
      }

      {
        !isKnown && (
          <div className='chatBodyUnKnown'>
            <p>Not Allowed</p>
          </div>
        )
      }

    </>
  );
}

export default ChatBody;