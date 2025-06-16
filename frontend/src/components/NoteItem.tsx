// src/components/NoteItem.tsx
import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import type { Note } from '../features/notes/noteSlice';
import './NoteItem.css';

interface Props {
  note: Note;
  onEdit?: () => void;
  onDelete?: () => void;
  draggableProps?: any; // 👈 för DnD-kit
  dragHandleProps?: any;
  innerRef?: any;
}

const NoteItem: React.FC<Props> = ({ note, onEdit, onDelete, draggableProps, dragHandleProps, innerRef }) => {
  const dateLabel =
    note.modified_at && note.modified_at !== note.created_at
      ? `Redigerad: ${new Date(note.modified_at).toLocaleString()}`
      : `Skapad: ${new Date(note.created_at).toLocaleString()}`;

  return (
    <ListGroup.Item
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="note-item d-flex justify-content-between align-items-start"
      onClick={onEdit}
    >
      <div className="note-clickable" >
        <strong>{note.title}</strong>
        <div>{note.text}</div>
        <small className="text-muted">{dateLabel}</small>
      </div>
      {onDelete && (
        <div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Ta bort
          </Button>
        </div>
      )}
    </ListGroup.Item>
  );
};

export default NoteItem;
