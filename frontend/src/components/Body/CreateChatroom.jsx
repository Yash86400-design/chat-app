import React, { useContext, useEffect, useRef, useState } from 'react';
import './createChatroom.css';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createChatroom, userData } from '../../features/userSlice';
import ChatIdContext from '../../context/ChatIdContext';

function CreateChatroom({ pageWidth }) {

  const [createButtonActive, setCreateButtonActive] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profile, setProfile] = useState('');
  const createChatroomRef = useRef(null);
  const dispatch = useDispatch();
  const { chatUserInfo } = useContext(ChatIdContext);

  const handleCreateChatroomButton = (event) => {
    setCreateButtonActive(!createButtonActive);
    event.stopPropagation();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !description) {
      return toast.error("Name or Description field can't be empty");
    }

    if (name.length < 3 || name.length > 30 || description.length < 10 || description.length > 200) {
      return toast.error("Name length should be in range 3 to 30, Description length should be in range 10 to 200");
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('avatar', profile);

    dispatch(createChatroom(formData))
      .then(() => {
        setName('');
        setDescription('');
        setProfile('');
        dispatch(userData());
      });

    setCreateButtonActive(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleProfileChange = (event) => {
    setProfile(event.target.files[0]);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (createChatroomRef.current && !createChatroomRef.current.contains(event.target)) {
        setCreateButtonActive(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {pageWidth < 768 && (
        <div className={`createChatroomContainer ${chatUserInfo.id === '' ? 'createChatroomContainerActive' : 'createChatroomContainerInActive'}`}>
          <button className='createChatroomButton' onClick={handleCreateChatroomButton}>Create Chatroom</button>
          {createButtonActive && (
            <div className="createChatroomForm" ref={createChatroomRef}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="profile">Chatroom Profile: </label>
                <input
                  type='file'
                  id='profile'
                  name='profile'
                  accept='image/*'
                  onChange={handleProfileChange}
                />

                <label htmlFor="name">Chatroom Name: </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={name}
                  onChange={handleNameChange}
                />

                <label htmlFor="description">Description: </label>
                <input type="text" name="description" id="description" value={description} onChange={handleDescriptionChange} cols="30" rows="10"></input>

                <button type="submit">Create</button>
              </form>
            </div>
          )}
        </div>
      )}
      {pageWidth >= 768 && (
        <div className='createChatroomContainer'>
          <button className='createChatroomButton' onClick={handleCreateChatroomButton}>Create Chatroom</button>
          {createButtonActive && (
            <div className="createChatroomForm" ref={createChatroomRef}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="profile">Chatroom Profile: </label>
                <input
                  type='file'
                  id='profile'
                  name='profile'
                  accept='image/*'
                  onChange={handleProfileChange}
                />

                <label htmlFor="name">Chatroom Name: </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={name}
                  onChange={handleNameChange}
                />

                <label htmlFor="description">Description: </label>
                <input type="text" name="description" id="description" value={description} onChange={handleDescriptionChange} cols="30" rows="10"></input>

                <button type="submit">Create</button>
              </form>
            </div>
          )}
        </div>

      )}
    </>
  );
}

export default CreateChatroom;