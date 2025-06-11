// src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/notes';

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(username, password);
      // Viktigt: skicka både accessToken och refreshToken till login-funktionen
      login(data.accessToken, data.refreshToken);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Fel användarnamn eller lösenord');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Logga in</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Användarnamn</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Lösenord</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button type="submit">Logga in</Button>
    </Form>
  );
};

export default Login;
