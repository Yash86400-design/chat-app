import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/authSlice';

function Register() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const formSubmit = (e) => {
    e.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast.error('Invalid Email Address');
    } else {
      const userData = {
        name, email, password
      };
      dispatch(register(userData));
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      toast.success(message);
      navigate("/signin");
    }

    dispatch(reset());
  }, [isError, isSuccess, navigate, user, message, dispatch]);

  return (
    <div className="register-page-container">

      <div className="register-container">
        <h2>Registration</h2>
        <form onSubmit={formSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <button type="submit">Register</button>
          </div>
        </form>
        <p>Already have an account? <Link to='/signin'>Sign In</Link></p>
      </div>
    </div>

  );
}

export default Register;
