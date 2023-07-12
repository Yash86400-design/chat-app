import { useEffect, useRef, useState } from 'react';
import './chatInput.css';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageToChatroomResponse, sendMessageToUserResponse } from '../../features/userSlice';
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-toastify';
// import userService from '../../services/userService';

function ChatInput({ userType, isKnown, userId, socketInstance, socketId }) {
  // const [messageInputField, setMessageInputField] = useState('');
  const [inputPlaceholder, setInputPlaceholder] = useState('');
  const [readOnlyState, setReadOnlyState] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { sendingMessageLoading, isError, message, userProfile } = useSelector((state) => state.userProfile);

  const handleChatSubmittion = (event) => {
    let message = inputRef.current.value;
    if (userType === 'User' && message.length > 0) {
      dispatch(sendMessageToUserResponse({ userId: userId, message: message }));
      // socketInstance.emit('personalMessage', { userId, message });
      // socketInstance.emit('userMessage', { userId, message });
      socketInstance.emit('sendMessage', { socketId, message, name: userProfile.name, senderId: userProfile._id });
      // userService.messageSendToUser(userId, message);
      // socketInstance.emit('chatMessage', message);
      message = null;
      inputRef.current.value = null;
      inputRef.current.focus();
    } else if (userType === 'Chatroom' && message.length > 0) {
      // userService.messageSendToChatroom(userId, message);
      dispatch(sendMessageToChatroomResponse({ chatroomId: userId, message: message }));
      // socketInstance.emit('chatroomMessage', { userId, message: message });
      socketInstance.emit('sendMessage', { socketId, message, name: userProfile.name, senderId: userProfile._id });
      message = null;
      inputRef.current.value = null;
      inputRef.current.focus();
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

    /*
      if (isKnown === false && userType === 'User') {
        setInputPlaceholder('Only friends are allowed to message');
      }
      else if (isKnown === false && userType === 'Chatroom') {
        console.log('Hi');
        setInputPlaceholder('Only members are allowed to message');
      }
      else if (isKnown) {
        setInputPlaceholder('Type a message...');
        inputRef.current.value = '';
        inputRef.current.focus();
      } 
    */

  }, [isKnown, userType]);

  useEffect(() => {

    if (isError) {
      toast.error(message);
    }

  }, [sendingMessageLoading, isError, message]);



  return (
    <div className='chatInput'>
      {/* <input type="text" value={messageInputField} name="" id="" placeholder='Type a message...' onChange={(event) => { setMessageInputField(event.target.value); }} autoFocus /> */}
      <input type="text" name="" id="" placeholder={inputPlaceholder} ref={inputRef} readOnly={readOnlyState} />
      {sendingMessageLoading && <Spinner />}
      <button disabled={buttonDisabled} onClick={handleChatSubmittion}>Send</button>
    </div>
  );
}

export default ChatInput;