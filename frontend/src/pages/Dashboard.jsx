import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './dashboard.css';
import createSocketInstance from '../socket/socket';
import BodyContainer from '../components/Body/BodyContainer';
import Chat from '../components/Chat/Chat';
import Spinner from '../components/Spinner/Spinner';
import { userData } from '../features/userSlice';
import { toast } from 'react-toastify';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userToken, isLoading, loginMessage, userProfile } = useSelector((state) => state.auth);
  const socket = createSocketInstance(userToken);
  const [pageWidth, setPageWidth] = useState(window.outerWidth);

  // Super helpful: Clearing the extra created toasts. It is used with ToastContainer limit specified in App.js
  const clearWaitingQueue = () => {
    toast.clearWaitingQueue();
  };

  useEffect(() => {
    // Redirect to signin if userToken is missing
    if (!userToken) {
      navigate('/signin');
    } else {
      // Fetch user data and set initial page width
      dispatch(userData());
      setPageWidth(window.outerWidth);

      // Add an event listener for window resize events
      const handleResize = () => {
        setPageWidth(window.outerWidth);
      };

      // Add the event listener for resize
      window.addEventListener('resize', handleResize);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [userToken, navigate, dispatch]);

  if (loginMessage) {
    toast.success(`Welcome ${userProfile?.name}, If you witness any spacing or alignment related issue, Please refresh the page🙏.`);
  }

  if (isLoading) {
    return <Spinner />;
  }

  clearWaitingQueue();

  return (
    userToken && (
      <div className="dashboard">
        <BodyContainer socket={socket} pageWidth={pageWidth} />
        <Chat socket={socket} pageWidth={pageWidth} />
      </div>
    )
  );
}

export default Dashboard;
