import { useState } from "react";

type Note = {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  modifiedAt: string;
};

type Props = {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, text: string) => void;
};

export default function NoteCard({ note, onDelete, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editText, setEditText] = useState(note.text);

  const handleSave = () => {
    onUpdate(note.id, editTitle, editText);
    setIsEditing(false);
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      {isEditing ? (
        <>
          <input
            className="border p-1 rounded w-full mb-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={50}
          />
          <textarea
            className="border p-1 rounded w-full mb-2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            maxLength={300}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1 rounded">Spara</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Avbryt</button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-lg">{note.title}</h2>
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="text-blue-500">✏️</button>
              <button onClick={() => onDelete(note.id)} className="text-red-500">🗑️</button>
            </div>
          </div>
          <p className="mb-2">{note.text}</p>
          <small className="text-gray-500">Senast ändrad: {new Date(note.modifiedAt).toLocaleString()}</small>
        </>
      )}
    </div>
  );
}
