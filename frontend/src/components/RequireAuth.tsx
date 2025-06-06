import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('token'); // eller annan metod för att kolla inloggning
  const location = useLocation();

  if (!token) {
    // Om inte inloggad, skicka till login-sida och spara return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
