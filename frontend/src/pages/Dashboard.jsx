import React, { useEffect } from 'react';
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

  const { userToken, isLoading, loginMessage } = useSelector((state) => state.auth);
  const socket = createSocketInstance(userToken);

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

  // useEffect(() => {
  //   if (loginMessage && userToken) {
  //     toast.success('Logged In Successfully');
  //   }
  // }, [loginMessage, userToken]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {
        userToken && (
          <div className="Dashboard">
            <BodyContainer />
            <Chat socket={socket} />
          </div>
        )
      }
    </>
  );
}

export default Dashboard;