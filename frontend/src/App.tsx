// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Notes from './pages/Notes';
import Search from './pages/SearchNotes';

const App: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <NavigationBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/notes" replace />}
          />

          <Route
            path="/notes"
            element={token ? <Notes /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/search"
            element={token ? <Search /> : <Navigate to="/login" replace />}
          />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
