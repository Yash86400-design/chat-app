import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import Dashboard from './pages/Dashboard'; 
// import SignIn from './pages/SignIn'; 
// import Register from './pages/Register'; 
import './App.css'; import NotFound from './pages/NotFound';
import ErrorBoundary from './utils/ErrorBoundary';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  return (
    <>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path='/' element={<Suspense fallback={<div>Dashboard Loading...</div>}><Dashboard /></Suspense>} />
            <Route path='/signin' element={<Suspense fallback={<div>SignIn Page Loading...</div>}><SignIn /></Suspense>} />
            <Route path='/register' element={<Suspense fallback={<div>Register Page Loading...</div>}><Register /></Suspense>} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Router>
      <ToastContainer limit={1} />
    </>
  );
}

export default App;