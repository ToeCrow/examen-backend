// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Swing Notes</Link>
      <div className="space-x-4">
        <Link to="/login" className="hover:underline">Logga in</Link>
        <Link to="/register" className="hover:underline">Registrera</Link>
        <Link to="/notes" className="hover:underline">Anteckningar</Link>
        <Link to="/docs" className="hover:underline">API Docs</Link>
      </div>
    </nav>
  );
}
