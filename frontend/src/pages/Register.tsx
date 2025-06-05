import { useState } from "react";
import API from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/user/signup", form);
      navigate("/login");
    } catch (err) {
      alert("Registrering misslyckades.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 flex flex-col gap-4">
      <input placeholder="Användarnamn" value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        className="p-2 border rounded" required />
      <input type="password" placeholder="Lösenord" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        className="p-2 border rounded" required />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Registrera</button>
    </form>
  );
}
