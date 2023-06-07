import React, { useEffect, useRef } from 'react';
import './chatInput.css';

function ChatInput({ userId }) {
  // const [messageInputField, setMessageInputField] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // setMessageInputField('');
    inputRef.current.value = '';
    inputRef.current.focus();
  }, [userId]);

  return (
    <div className='chatInput'>
      {/* <input type="text" value={messageInputField} name="" id="" placeholder='Type a message...' onChange={(event) => { setMessageInputField(event.target.value); }} autoFocus /> */}
      <input type="text" name="" id="" placeholder='Type a message...' ref={inputRef} autoFocus />
      <button>Send</button>
    </div>
  );
}

export default ChatInput;