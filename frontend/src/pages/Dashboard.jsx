import React from 'react';
import BodyContainer from '../components/Body/BodyContainer';
import Chat from '../components/Chat/Chat';

function Dashboard() {
  return (
    <div className="Dashboard">
      <BodyContainer />
      <Chat />
    </div>
  );
}

export default Dashboard;