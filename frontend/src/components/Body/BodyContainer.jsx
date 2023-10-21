import React, { useContext } from 'react';
import './bodyContainer.css';
import BodyHeader from './BodyHeader';
import BodyContacts from './BodyContacts';
import CreateChatroom from './CreateChatroom';
import ChatIdContext from '../../context/ChatIdContext';
import BodySearchContacts from './BodySearchContacts';

function BodyContainer({ socket, pageWidth }) {
  const { chatUserInfo } = useContext(ChatIdContext);

  const isSmallScreen = pageWidth < 768;
  const isChatActive = chatUserInfo.id !== '';

  return (
    <div className={`bodyContent ${isSmallScreen && isChatActive ? 'bodyContainerActive' : 'bodyContainerInActive'}`}>
      <BodyHeader socket={socket} pageWidth={pageWidth} /> 
      <CreateChatroom pageWidth={pageWidth} />
      <BodySearchContacts pageWidth={pageWidth} />
      <BodyContacts socket={socket} pageWidth={pageWidth} />
    </div>
  );
}

export default BodyContainer;
