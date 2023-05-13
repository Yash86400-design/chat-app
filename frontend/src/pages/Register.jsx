import React from 'react';
import { Link } from 'react-router-dom';
import './register.css';

function Register() {
  return (
    <div className="register-page-container">

      <div className="register-container">
        <h2>Registration</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
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
