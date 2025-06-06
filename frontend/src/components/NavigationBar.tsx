// src/components/NavigationBar.tsx

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Swing Notes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Hem</Nav.Link>
            {token && (
              <>
                <Nav.Link as={Link} to="/notes">Anteckningar</Nav.Link>
                <Nav.Link as={Link} to="/search">Sök</Nav.Link>
              </>
            )}
            <Nav.Link
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Swagger
            </Nav.Link>
          </Nav>
          <Nav>
            {token ? (
              <Button variant="outline-danger" onClick={handleLogout}>
                Logga ut
              </Button>
            ) : (
              <Nav.Link as={Link} to="/login" className="btn btn-outline-primary">
                Logga in
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
