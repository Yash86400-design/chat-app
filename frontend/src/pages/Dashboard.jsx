import React, { useEffect } from 'react';
import BodyContainer from '../components/Body/BodyContainer';
import Chat from '../components/Chat/Chat';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';
import './dashboard.css';
import { userData } from '../features/userSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userToken, isLoading } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (userToken) {
  //     dispatch(userData());
  //   }
  // }, [dispatch, userToken]);

  useEffect(() => {
    if (!userToken) {
      navigate('/signin');
    } else {
      dispatch(userData());
    }
  }, [userToken, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="Dashboard">
      <BodyContainer />
      <Chat />
    </div>
  );
}

export default Dashboard;