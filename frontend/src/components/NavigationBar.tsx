// src/components/NavigationBar.tsx

import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../utils/api';

const NavigationBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setUsername(user.username);
      } catch {
        setUsername(null);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Swing Notes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isAuthenticated && <Nav.Link as={Link} to="/notes">Anteckningar</Nav.Link>}
            {isAuthenticated && <Nav.Link as={Link} to="/board">Planera</Nav.Link>}
            <Nav.Link href="http://localhost:3000/api-docs" target="_blank">Swagger</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-outline-primary me-2">
                  Logga in
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="btn btn-outline-secondary">
                  Skapa konto
                </Nav.Link>
              </>
            ) : (
              <>
                {username && (
                  <Navbar.Text className="me-3">
                    <strong>{username}</strong>
                  </Navbar.Text>
                )}
                <Button variant="outline-danger" onClick={handleLogout}>Logga ut</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
