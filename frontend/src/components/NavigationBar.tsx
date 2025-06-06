// src/components/NavigationBar.tsx

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
            {isAuthenticated && <Nav.Link as={Link} to="/search">Sök</Nav.Link>}
            <Nav.Link href="http://localhost:3000/api-docs" target="_blank">Swagger</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            {!isAuthenticated ? (
              <Nav.Link as={Link} to="/login" className="btn btn-outline-primary">
                Logga in
              </Nav.Link>
            ) : (
              <Button variant="outline-danger" onClick={handleLogout}>Logga ut</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
