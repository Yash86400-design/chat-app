import React, { useEffect } from 'react';
import BodyContainer from '../components/Body/BodyContainer';
import Chat from '../components/Chat/Chat';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  return (
    <div className="Dashboard">
      <BodyContainer />
      <Chat />
    </div>
  );
}

export default Dashboard;