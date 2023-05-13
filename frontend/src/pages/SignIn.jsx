import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signin.css';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form data:', formData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="signin-page-container">
      <div className="signin-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
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
