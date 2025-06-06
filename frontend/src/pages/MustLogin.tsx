// src/pages/MustLogin.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const MustLogin: React.FC = () => {
  return (
    <div>
      <h2>Du måste vara inloggad för att se denna sida.</h2>
      <p><Link to="/login">Gå till inloggning</Link></p>
    </div>
  );
};

export default MustLogin;
