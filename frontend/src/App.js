import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <PrivateRoute exact path='/' component={Dashboard} /> */}
          <Route path='/' element={<Dashboard />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>

  );
}

export default App;

