import { useEffect, useRef, useState } from 'react';
import './chatInput.css';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageToChatroomResponse, sendMessageToUserResponse } from '../../features/userSlice';
import { toast } from 'react-toastify';

function ChatInput({ userType, isKnown, userId, socketInstance, socketId }) {
  const [inputPlaceholder, setInputPlaceholder] = useState('');
  const [readOnlyState, setReadOnlyState] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { isError, message, userProfile } = useSelector((state) => state.userProfile);

  const handleChatSubmittion = () => {
    const message = inputRef.current.value;
    if (message.length > 0) {
      if (userType === 'User') {
        dispatch(sendMessageToUserResponse({ userId: userId, message: message }));
        socketInstance.emit('sendMessage', { socketId, message, name: userProfile.name, senderId: userProfile._id });
      } else if (userType === 'Chatroom') {
        dispatch(sendMessageToChatroomResponse({ chatroomId: userId, message: message }));
        socketInstance.emit('sendMessage', { socketId, message, name: userProfile.name, senderId: userProfile._id });
      }
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleChatSubmittion();
    }
  };

  useEffect(() => {
    if (isKnown === true) {
      inputRef.current.focus();
      inputRef.current.value = '';
      setReadOnlyState(false);
      setButtonDisabled(false);
      setInputPlaceholder('Type a message...');
    } else if (isKnown === false) {
      setReadOnlyState(true);
      setButtonDisabled(true);
      setInputPlaceholder(
        userType === 'User' ? 'Only friends are allowed to message' : 'Only members are allowed to message'
      );
    }
  }, [isKnown, userType]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  return (
    <div className='chatInput'>
      <input type="text" name="" id="" placeholder={inputPlaceholder} ref={inputRef} readOnly={readOnlyState} onKeyUp={handleKeyUp} />
      <button disabled={buttonDisabled} onClick={handleChatSubmittion}>Send</button>
    </div>
  );
}

export default ChatInput;
