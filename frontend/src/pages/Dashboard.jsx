import React, { useEffect, useState } from 'react';
import BodyContainer from '../components/Body/BodyContainer';
import Chat from '../components/Chat/Chat';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';
import './dashboard.css';
import { userData } from '../features/userSlice';
import createSocketInstance from '../socket/socket';
import { toast } from 'react-toastify';

function Dashboard() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userProfile, userToken, isLoading, loginMessage } = useSelector((state) => state.auth);
  const socket = createSocketInstance(userToken);
  const [pageWidth, setPageWidth] = useState(window.outerWidth);

  // useEffect(() => {
  //   if (userToken) {
  //     dispatch(userData());
  //   }
  // }, [dispatch, userToken]);

  useEffect(() => {

    // Add an event listener for window resize events
    const handleResize = () => {
      setPageWidth(window.outerWidth);
    };
    if (!userToken) {
      navigate('/signin');
    } else if (userToken) {
      dispatch(userData());
      setPageWidth(window.outerWidth); // Initialzier with the initial window width

      // Add the event listener for resize
      window.addEventListener('resize', handleResize);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [userToken, navigate, dispatch, pageWidth]);

  //? Will implement this login toast later, currently it is showing up twice I don't know why...

  // useEffect(() => {
  //   if (loginMessage !== null) {
  //     toast.success(`Welcome back ${userProfile?.name}`);
  //   }
  // }, [loginMessage]);
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {
        userToken && (
          <div className="dashboard">
            <BodyContainer socket={socket} pageWidth={pageWidth} className='primaryBodyContainer' />
            <Chat socket={socket} className='primaryChatContainer' pageWidth={pageWidth} />
          </div>
        )
      }
    </>
  );
}

export default Dashboard;