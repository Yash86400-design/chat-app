import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/authSlice';
import Spinner from '../components/Spinner/Spinner';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ userName: '', email: '', password: '' });
  const { userName, email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const formSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error('Invalid Email Address');
    } else {
      const userData = { userName, email, password };
      dispatch(register(userData))
        .then(() => {
          setFormData({ userName: '', email: '', password: '' });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      toast.success(message);
      navigate('/signin');
    }

    dispatch(reset());
  }, [isError, isSuccess, navigate, user, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="register-page-container">
      <div className="register-container">
        <header className="register-header">
          <h2>Welcome to Chat App</h2>
          <p>Create your account to get started</p>
        </header>
        <form onSubmit={formSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Name:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={userName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">Register</button>
          </div>
        </form>
        <p className="already-have-account">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
