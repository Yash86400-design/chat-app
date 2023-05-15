import React, { useEffect } from 'react';
import BodyContainer from '../components/Body/BodyContainer';
import Chat from '../components/Chat/Chat';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';
import './dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const { userToken, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userToken) {
      navigate('/signin');
    }
  }, [userToken, navigate]);

  if (isLoading) {
    <Spinner />;
  }

  return (
    <div className="Dashboard">
      <BodyContainer />
      <Chat />
    </div>
  );
}

export default Dashboard;