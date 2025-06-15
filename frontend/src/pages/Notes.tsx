import React, { useEffect, useState } from 'react';
import { Button, Form, Alert, ListGroup, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchAllNotes,
  deleteExistingNote,
} from '../features/notes/noteSlice';
import type { Note } from '../features/notes/noteSlice';
import NoteFormModal from '../components/NoteFormModal';
import EditNoteModal from '../components/EditNoteModal';
import NoteItem from '../components/NoteItem';

const Notes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notes, loading, error } = useAppSelector(state => state.notes);

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    dispatch(fetchAllNotes());
  }, [dispatch]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    setFilteredNotes(
      notes.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.text.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, notes]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Är du säker på att du vill radera anteckningen?')) {
      await dispatch(deleteExistingNote(id));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Dina Anteckningar</h2>
        <Button onClick={() => setShowCreateModal(true)}>+ Ny anteckning</Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Sök bland anteckningar..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" />}
      {!loading && filteredNotes.length === 0 && <p>Inga anteckningar hittades.</p>}

      <ListGroup>
        {filteredNotes.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            onEdit={() => {
              setEditingNote(note);
              setShowEditModal(true);
            }}
            onDelete={() => handleDelete(note.id)}
          />
        ))}
      </ListGroup>

      <NoteFormModal show={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <EditNoteModal note={editingNote} show={showEditModal} onClose={() => setShowEditModal(false)} />
    </div>
  );
};

export default Notes;
