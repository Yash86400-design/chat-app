import React, { useContext, useState } from 'react';
import './bodyContainer.css';
import BodyHeader from './BodyHeader';
import BodyContacts from './BodyContacts';
import CreateChatroom from './CreateChatroom';
import ChatIdContext from '../../context/ChatIdContext';

function BodyContainer({ socket, pageWidth }) {
  // const [bodyContainerSelected, setBodyContainerSelected] = useState(false);
  // const handleChatInboxClick = () => {
  //   console.log(pageWidth);
  //   setBodyContainerSelected(true);
  // };

  const { chatUserInfo } = useContext(ChatIdContext);

  return (
    <>
      {/* {pageWidth < 768 && (
        <div className={`bodyContent ${chatUserInfo.id === '' ? 'bodyContainerInActive' : 'bodyContainerActive'}`} >
          <BodyHeader socket={socket} pageWidth={pageWidth} />
          <CreateChatroom pageWidth={pageWidth} />
          <BodyContacts socket={socket} pageWidth={pageWidth} />
        </div>
      )} */}

      {/* {pageWidth > 768 && ( */}
      {/* Merged both question in one if the screen size is more than 768 than we want nothing but when the screen size is less than we'll check whether the chat is clicked or not, through which we'll decide whether to give full width or not... */}
      <div className={`bodyContent ${pageWidth < 768 ? `${chatUserInfo.id === '' ? 'bodyContainerInActive' : 'bodyContainerActive'}` : ''}`}>
        <BodyHeader socket={socket} pageWidth={pageWidth} />
        <CreateChatroom pageWidth={pageWidth} />
        <BodyContacts socket={socket} pageWidth={pageWidth} />
      </div>
      {/* )} */}

    </>

  );
}

export default BodyContainer;