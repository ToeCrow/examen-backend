// src/pages/SignupPage.tsx

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:3000/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Något gick fel vid registrering');
        return;
      }

      setSuccess('Konto skapat! Du kan nu logga in.');
      // Valfritt: automatiskt skicka användaren till login efter några sekunder:
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch {
      setError('Serverfel, försök igen senare');
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Skapa konto</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Användarnamn</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={20}
          placeholder="Ange användarnamn"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Lösenord</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Ange lösenord"
        />
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100">Registrera</Button>
    </Form>
  );
};

export default SignupPage;
