// src/pages/Notes.tsx

import { useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  modifiedAt: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/notes", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Du är inte inloggad. Logga in för att se dina anteckningar.");
          } else {
            throw new Error(`Fel vid hämtning av anteckningar: ${response.status} ${response.statusText}`);
          }
        }

        const data = await response.json();
        setNotes(data);
      } catch (error: any) {
        console.error("Error fetching notes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Mina Anteckningar</h1>

      {loading && (
        <div className="text-center text-gray-500">Laddar anteckningar...</div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center">
          {error}
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <div className="text-center text-gray-600">Inga anteckningar hittades.</div>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border border-gray-300 p-4 rounded shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
            <p className="mb-2">{note.text}</p>
            <div className="text-sm text-gray-500">
              Skapad: {new Date(note.createdAt).toLocaleString()} <br />
              Senast ändrad: {new Date(note.modifiedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
