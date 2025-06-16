import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home        from './pages/Home';
import Login       from './pages/Login';
import Notes       from './pages/Notes';
import SignupPage  from './pages/SignupPage';
import PrivateRoute  from './components/PrivateRoute';
import { AuthProvider }  from './context/AuthContext';
import AutoLogoutHandler from './context/AutoLogoutHandler';
import BoardView from './pages/BoardView';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AutoLogoutHandler /> {/* Hanterar inaktivitet + token-refresh */}
      <NavigationBar />

      <div className="container mt-4">
        <Routes>
          <Route path="/"       element={<Home />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/notes"  element={<Notes />} />
            <Route path="/board" element={<BoardView />} />
          </Route>
          
          {/* Fallback: */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
);

export default App;
