import { useEffect, useState } from "react";
import API from "../api/client";
import NoteCard from "../components/NoteCard";

type Note = {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  modifiedAt: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch {
      alert("Kunde inte hämta anteckningar.");
    }
  };

  const createNote = async () => {
    if (!title || !text) return alert("Fyll i titel och text.");
    await API.post("/notes", { title, text });
    setTitle("");
    setText("");
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  const updateNote = async (id: string, newTitle: string, newText: string) => {
    await API.put(`/notes`, { id, title: newTitle, text: newText });
    fetchNotes();
  };

  const handleSearch = async () => {
    try {
      const res = await API.get(`/notes/search?q=${search}`);
      setNotes(res.data);
    } catch {
      alert("Sökning misslyckades.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4 font-semibold">Mina anteckningar</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök på titel"
          className="border p-2 flex-1 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 rounded">
          Sök
        </button>
      </div>

      <div className="mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          className="p-2 border rounded w-full mb-2"
          maxLength={50}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text"
          className="p-2 border rounded w-full mb-2"
          maxLength={300}
        />
        <button
          onClick={createNote}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Spara anteckning
        </button>
      </div>

      <ul className="space-y-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onUpdate={updateNote}
          />
        ))}
      </ul>
    </div>
  );
}
