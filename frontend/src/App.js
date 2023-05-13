import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './App.css';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import { useEffect } from 'react';
import Register from './pages/Register';

function PrivateRoute({ component: Component, ...rest }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signin');
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? <Component {...rest} /> : null;

}

function App() {
  return (
    <Router>
      <Routes>
        {/* <PrivateRoute exact path='/' component={Dashboard} /> */}
        <Route path='/' element={<PrivateRoute component={Dashboard} />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

