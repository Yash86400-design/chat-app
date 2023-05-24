import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signin.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { reset, signin } from '../features/authSlice';
import Spinner from '../components/Spinner/Spinner';
import { userData } from '../features/userSlice';

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { email, password } = formData;

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signin(formData));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      dispatch(userData())
      navigate('/');
    }

    dispatch(reset());
  }, [message, isError, navigate, dispatch, isSuccess, user]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="signin-page-container">
      <div className="signin-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <button type="submit">Sign In</button>
          </div>
        </form>
        <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
      </div>
    </div>

  );
}

export default SignIn;
