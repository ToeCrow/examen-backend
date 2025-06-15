import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { clearLogoutMessage, setLogoutMessage } from '../features/notificatons/notificationSlice';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const dispatch = useDispatch();

  const logoutMessage = useSelector((state: RootState) => state.notification.logoutMessage);

  useEffect(() => {
    const state = location.state as { reason?: string } | null;

    // Om AutoLogout skickar state och Redux inte redan har meddelandet
    if (state?.reason === 'inactivity' && !logoutMessage) {
      dispatch(setLogoutMessage('Du loggades ut på grund av inaktivitet.'));
    }
  }, [location.state, dispatch, logoutMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(username, password); // { accessToken, refreshToken }
      login(data.accessToken, data.refreshToken);
      dispatch(clearLogoutMessage());
      navigate('/notes');
    } catch (err: any) {
      setError(err.message || 'Fel vid inloggning');
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2 className="mb-3">Logga in</h2>

      {logoutMessage && (
        <Alert
          variant="warning"
          dismissible
          onClose={() => dispatch(clearLogoutMessage())}
        >
          {logoutMessage}
        </Alert>
      )}

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

      <Button type="submit" className="w-100">
        Logga in
      </Button>
    </Form>
  );
};

export default Login;
