import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import type { Note } from '../features/notes/noteSlice';
import './NoteItem.css'; // <-- ny stilfil (se nedan)

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteItem: React.FC<Props> = ({ note, onEdit, onDelete }) => {
  const dateLabel =
    note.modified_at && note.modified_at !== note.created_at
      ? `Redigerad: ${new Date(note.modified_at).toLocaleString()}`
      : `Skapad: ${new Date(note.created_at).toLocaleString()}`;

  return (
    <ListGroup.Item className="note-item d-flex justify-content-between align-items-start">
      <div className="note-clickable" onClick={onEdit}>
        <strong>{note.title}</strong>
        <div>{note.text}</div>
        <small className="text-muted">{dateLabel}</small>
      </div>
      <div>
        <Button variant="outline-danger" size="sm" onClick={(e) => {
          e.stopPropagation(); // Förhindra att redigeringsmodal triggas
          onDelete();
        }}>
          Ta bort
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default NoteItem;
