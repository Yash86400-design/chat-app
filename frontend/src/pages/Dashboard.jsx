import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './dashboard.css';
import createSocketInstance from '../socket/socket';
import BodyContainer from '../components/Body/BodyContainer';
import Chat from '../components/Chat/Chat';
import Spinner from '../components/Spinner/Spinner';
import { userData } from '../features/userSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userToken, isLoading } = useSelector((state) => state.auth);
  const socket = createSocketInstance(userToken);
  const [pageWidth, setPageWidth] = useState(window.outerWidth);

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

  if (isLoading) {
    return <Spinner />;
  }

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
