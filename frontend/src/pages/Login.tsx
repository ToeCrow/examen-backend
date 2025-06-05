import { useState } from "react";
import API from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/notes");
    } catch {
      alert("Inloggning misslyckades");
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
      <button type="submit" className="bg-green-500 text-white p-2 rounded">Logga in</button>
    </form>
  );
}
